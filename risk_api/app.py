import os
import traceback
import json
import statistics
from find_risk import find_risk, find_intervention
import sqlite3
import pandas as pd
import logging
from flask import Flask, request, Response, jsonify

app = Flask(__name__)

logging.basicConfig(filename="risk_api.log", level=logging.DEBUG)


@app.route("/calculate_risk", methods=["POST"])
def multiple_risk():
    try:
        map = {0: 1, 1: 1, 2: 5, 3: 5, 4: 10, 5: 10}
        ip = json.loads(request.data)
        question_answers = ip["question_answer"]
        out = {}
        for i in question_answers:
            if out.get(i["question_id"]["risk_type"]) is None:
                out[i["question_id"]["risk_type"]] = []
            out[i["question_id"]["risk_type"]].append(
                (i["question_id"]["question_impact_values"] + i["answer"]["weightage"])
                * map[i["answer"]["weightage"]]
            )
        out = {key: statistics.mean(values) for key, values in out.items()}
        # TODO Total Risk or sum or mean or weightage
        weight = {
            "Performance Risk": 5,
            "Financial Risk": 3,
            "Quality Risks": 2,
            "Compliance Risk": 4,
        }
        tmp = []
        total_weight = 0
        for key, value in out.items():
            tmp.append(
                out[key] * weight.get(key, 0)
            )  # TODO: Check why this is an issue
            total_weight += weight.get(key, 0)  # TODO: Check why this is an issue
        out["Total Risk (SUM)"] = sum(list(out.values()))
        out["Total Risk (Weighted Average)"] = sum(tmp) / total_weight
        grant_id = ip["grant_id"]
        output = {}
        if ip["type"] not in ["new", "fresh"]:
            conn = sqlite3.connect("SAF.db")
            df = pd.read_sql(f"SELECT * FROM SAF", con=conn)
            if grant_id not in df["Grant ID"].tolist():
                out["SAF"] = "GRANT_ID NOT PRESENT".lower()
                output["grantee_grant_id"] = ip["grantee_grant_id"]
                output["risk_score"] = out
                output["Grant_ID"] = ip["grant_id"]
                output["Weight"] = weight
                app.logger.info(output)
                return Response(json.dumps(output), 206, mimetype="application/json")
            df = df[df["Grant ID"] == grant_id]
            saf = find_risk(df)
            intervention = find_intervention(df)
            out["SAF Risk"] = int(saf)
            out["Intervention"] = intervention
        output["grantee_grant_id"] = ip["grantee_grant_id"]
        output["risk_score"] = out
        output["Weight"] = weight
        output["Grant_ID"] = ip["grant_id"]
        app.logger.info(output)
        return output
    except Exception:
        return jsonify(traceback.print_exc())


if __name__ == "__main__":
    app.run("0.0.0.0", port=os.environ["PORT"], debug=True)
