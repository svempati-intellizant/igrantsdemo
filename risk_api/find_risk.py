import pandas as pd
import numpy as np
import itertools


def less_than_ten(df, idx):
    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Grant Authorized"]
    grant_authorized = df2.values.tolist()
    try:
        grant_authorized = list(set(list(itertools.chain(*grant_authorized))))
    except Exception:
        grant_authorized = list(set(grant_authorized))
    if len(grant_authorized) == 1:
        try:
            logic1 = int(grant_authorized[0]) < 750000
        except Exception:
            logic1 = True
    else:
        assert False, "More than one grant value"
    subrecipient = df["No. of Sub recipients"].values.tolist()
    logic2 = True
    for i in subrecipient:
        try:
            if int(i) > 1:
                logic2 = False
        except Exception:
            pass
    return logic1 and logic2


# risk equals 10


def equal_to_ten(df, idx, question_dict, print_values=False):
    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = (program_type.count("A") >= 2) and (program_type.count("B") == 0)
    logic2 = (program_type.count("A") >= 2) and (program_type.count("B") == 0)
    logic3 = (program_type.count("A") >= 2) and (program_type.count("B") == 0)
    logic4 = df["Material Weakness"].values.tolist()[0:2] == ["N", "N"]
    logic5 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic7 = df["QCosts"].values.tolist().count("Y") >= 2
    """
    Does entity disburses funds through third party contracts?
    """
    question = "Does entity disburses funds through third party contracts?"
    logic_8 = eval_question(question, question_dict, df, idx)
    """
    To do:
     - Logic 6 -> and must not have had significant deficiencies in the audit report
    """
    if print_values:
        print("Logic1 (Major Program)------>", program_type)
        print(
            "Logic5 (Material Weakness)------>",
            df["Material Weakness"].values.tolist()[0:2],
        )
        print(
            "Logic7 (Opinion on Audit Findings)------>",
            df["Opinion on Audit Findings"].values.tolist(),
        )
    return all([logic1, logic2, logic3, logic4, logic5, logic7]) or logic_8


# risk equals 20


def equal_to_20(df, idx, question_dict, print_values=False):
    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic1 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic2 = (program_type.count("A") >= 2) and (program_type.count("B") == 0)
    logic4 = df["Material Weakness"].values.tolist()[0:2] == ["N", "N"]
    logic5 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic6 = df["QCosts"].values.tolist().count("Y") >= 2
    """
    To do:
     - logic3 -> and Other non compliance is there
     - logic7 -> and must not have had significant deficiencies in the audit report # DOne 
     - logic8 -> Type of Audit Compliance Requirements is A or B or C or D # Done 
    """
    if print_values:
        print("Logic1 (Major Program)------>", program_type)
        print(
            "Logic5 (Material Weakness)------>",
            df["Material Weakness"].values.tolist()[0:2],
        )
        print(
            "Logic6 (Opinion on Audit Findings)------>",
            df["Opinion on Audit Findings"].values.tolist(),
        )
    return all([logic1, logic2, logic4, logic5, logic6])


# risk equals 30


def equal_to_30(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    sub_rec = list(
        map(
            int,
            [
                re.sub("%", "", i)
                for i in df["Sub recipient's share"].values.tolist()
                if i != " "
            ],
        )
    )
    logic3 = False if sub_rec == [] else max(sub_rec) > 50
    logic4_and_5 = program_type[0] == "A" and program_type[-1] == "A"
    no_sub_rec = list(
        map(
            int,
            [i for i in df["No. of Sub recipients"].values.tolist() if type(i) is int],
        )
    )
    no_sub_rec = [0] if no_sub_rec == [] else no_sub_rec
    logic6 = max(no_sub_rec) > 1
    logic7 = df["Multiple Grantors"].values.tolist().count("Y") >= 1
    """
    AI Question Matrix :: 
        Is delay expected in corrective action plan?
        Are multiple internal control structures present?
        Are there balances outstanding at the end of the audit period?
    """

    question1 = "Is delay expected in corrective action plan?"
    question2 = " Are multiple internal control structures present?"
    question3 = "Are there balances outstanding at the end of the audit period?"
    logic_8_9_10 = (
        eval_question(question1, question_dict, df, idx)
        or eval_question(question2, question_dict, df, idx)
        or eval_question(question3, question_dict, df, idx)
    )
    logic11 = program_type.count("B") >= 1
    if print_values:
        print(sub_rec)
        print(logic7)
    return (
        all([logic1, logic2, any([logic3, logic4_and_5, logic6, logic7]), logic_8_9_10])
        or logic11
    )


# risk equals 40


def equal_to_40(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    question1 = "Does entity disburses funds through third party contracts?"
    logic3 = eval_question(question1, question_dict, df, idx)
    logic4 = df["Payroll costs % of overall costs"].values.tolist().count("Y") >= 1
    """
    To do:
     - Logic 5 -> and must not have had significant deficiencies in the audit report
    """
    """
    Question :: 
        IS there any reimbursements pending?
        as the Corporation made the total required reserve for replacement deposits?
        Has the grantee used the de minimis cost rate?
    """
    question1 = "IS there any reimbursements pending?"
    question2 = (
        "Has the Corporation made the total required reserve for replacement deposits?"
    )
    question3 = "Has the grantee used the de minimis cost rate?"
    logic_6_7_8 = (
        eval_question(question1, question_dict, df, idx)
        or eval_question(question2, question_dict, df, idx)
        or eval_question(question3, question_dict, df, idx)
    )
    no_sub_rec = list(
        map(
            int,
            [i for i in df["No. of Sub recipients"].values.tolist() if type(i) is int],
        )
    )
    no_sub_rec = [0] if no_sub_rec == [] else no_sub_rec
    logic10 = max(no_sub_rec) > 1

    """
    Logic 11 
    Subrecipient non compliance without material weakness or significant deficiencies
    """
    logic12 = program_type.count("B") >= 1
    sub_rec = list(
        map(
            int,
            [
                re.sub("%", "", i)
                for i in df["Sub recipient's share"].values.tolist()
                if i != " "
            ],
        )
    )
    logic13 = False if sub_rec == [] else min(sub_rec) < 50
    return all([logic1, logic2, logic4, any([logic_6_7_8, logic10])]) or all(
        [logic12, logic13]
    )


# risk equals 50
def equal_to_50(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    """
    Is delay expected in corrective action plan?
    The system for monitoring subrecipients is weak?
    Is there any noncompliance information present in the findings?
    Are there any not allowable expenditures?
    """
    question1 = "Is delay expected in corrective action plan?"
    question2 = "IS the system for monitoring subrecipients is weak?"
    question3 = "Is there any noncompliance information present in the findings?"
    question4 = "Are there any not allowable expenditures?"
    logic_4_5_6_7 = (
        eval_question(question1, question_dict, df, idx)
        or eval_question(question2, question_dict, df, idx)
        or eval_question(question3, question_dict, df, idx)
        or eval_question(question4, question_dict, df, idx)
    )
    #     logic_8 dosent exist
    no_sub_rec = list(
        map(
            int,
            [i for i in df["No. of Sub recipients"].values.tolist() if type(i) is int],
        )
    )
    no_sub_rec = [0] if no_sub_rec == [] else no_sub_rec
    logic9 = max(no_sub_rec) > 1
    logic10 = df["Material Weakness"].values.tolist()[0:2] == ["N", "N"]

    logic11 = program_type.count("B") >= 1
    logic12 = bool(
        set(["A", "B", "C"])
        & set(df["Type of Audit Compliance Requirements"].values.tolist())
    )
    logic13 = set(df["Significant Deficiency"].values.tolist()) == {" "} or set(
        df["Significant Deficiency"].values.tolist()
    ) == {"N"}
    return all([logic1, logic2, logic_4_5_6_7, logic9, logic10]) or all(
        [logic11, logic12, logic13]
    )


# risk equals 60
def equal_to_60(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    logic3 = bool(
        set(["A", "B", "C"])
        & set(df["Type of Audit Compliance Requirements"].values.tolist())
    )
    """
    Is the competence and experience of personnel who administer the Federal programs low?
    Does amounts presented in this schedule differ from amounts presented in, or used in the preparation of, the financial statements?
    Are expenditure presented partially?
    Subrecipient
    and
    Does subrecipient has significant deficiencies?
    """
    question1 = "Is delay expected in corrective action plan?"
    question2 = "IS the system for monitoring subrecipients is weak?"
    question3 = "Is there any noncompliance information present in the findings?"
    logic_4_5_6_7 = (
        eval_question(question1, question_dict, df, idx)
        or eval_question(question2, question_dict, df, idx)
        or eval_question(question3, question_dict, df, idx)
    )
    logic8 = program_type.count("B") >= 1
    try:
        # print("HEy")
        grant_exp = list(
            map(
                int,
                [i for i in df["Grant Expended"].values.flatten().tolist() if i != " "],
            )
        )
        own_fund = list(
            map(int, [i for i in df["Own Funds"].values.flatten().tolist() if i != " "])
        )
        logic9 = (
            max(own_fund) > ((max(grant_exp) + max(own_fund)) / 50)
            if own_fund != [] and grant_exp != []
            else True
        )
        # print("Done")
    except Exception:
        logic9 = False
        # print("Oh")
        # print("Grant_exp--->", df["Grant Expended"])
        # assert False, "Error"
    return all([logic1, logic2, logic3, logic_4_5_6_7]) or all([logic8, logic9])


# risk equals 70
def equal_to_70(df, idx, question_dict, print_values=False):
    import re
    import datetime

    due_date = [i for i in df["Action Due Date"].values.flatten().tolist() if i != " "]
    # datestring = due_date[0]
    # today = datetime.datetime.combine(
    #     datetime.date.today(), datetime.time(0, 0))
    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    logic4 = True
    """
    IS management NOT adhering to Federal statutes, regulations, and the terms and conditions of Federal awards?
    IS there a significant impact on a Federal program?
    Is there incorrect data for patient revenue present?
    logic16 -> Has the grantee not provided federal awards to subrecipients?
    """
    question1 = "IS management NOT adhering to Federal statutes, regulations, and the terms and conditions of Federal awards?"
    question2 = "IS there a significant impact on a Federal program?"
    question3 = "Is there any noncompliance information present in the findings?"
    logic_5_6_7 = (
        eval_question(question1, question_dict, df, idx)
        or eval_question(question2, question_dict, df, idx)
        or eval_question(question3, question_dict, df, idx)
    )
    question_logic16 = " Has the grantee not provided federal awards to subrecipients?"
    """
    Logic 12 // --> Not Done
    Adverse opinion
    """
    logic8 = df["Repeat Finding"].values.tolist().count("Y") >= 1
    logic9 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic10 = df["QCosts"].values.tolist().count("Y") >= 1

    logic12 = df["Type of Audit Report"].values.tolist().count("A") >= 1
    logic11 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    subrecipient = list(set(df["Subrecipient"].values.tolist()))
    logic15 = len(subrecipient) == 1 and subrecipient == [" "]
    logic16 = eval_question(question_logic16, question_dict, df, idx)
    return all(
        [
            logic1,
            logic2,
            logic4,
            logic_5_6_7,
            any([logic8, logic9, logic10, logic11, logic12]),
            all([logic15, logic16]),
        ]
    )


# risk equals 80
def equal_to_80(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    #     Is there sign of accounting weakness?
    question1 = "Is there sign of accounting weakness?"
    logic3 = eval_question(question1, question_dict, df, idx)
    """
    Other non compliance is there
    must not have had Material weaknesses in internal control
    must not have had modified opinion in the audit report
    must not have Known or likely questioned costs exceeding 5% of total federal award expenditures  - last 2 years
    must not have had significant deficiencies in the audit report
    """
    logic4 = df["Other non Compliance"].values.tolist().count("Y") != 0
    logic5 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic6 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic7 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    next_logic = [logic4, logic7, logic5, logic6]
    logic8 = next_logic.count(True) >= 2
    #     print(next_logic)
    #     print(logic8 or logic2)
    logic9 = program_type.count("B") >= 1
    question18 = "Are charges and payments understated?"
    logic18 = eval_question(question18, question_dict, df, idx)
    #     print("logic1 :: ",logic1, "logic2 :: ",logic1, "logic3 :: ",logic3)
    #     print("logic1 --->",logic8)
    return (logic1 and logic2 and logic3 and logic9) or (logic9 and logic8 and logic18)


# risk equals 90


def equal_to_90(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    logic2 = "NIH" not in df2.values.tolist()
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("A") >= 2
    logic4 = df["Multiple Grantors"].values.tolist().count("Y") != 0
    logic5 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic6 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic7 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    logic8 = df["Other non Compliance"].values.tolist().count("Y") != 0
    combined_logic = [logic5, logic6, logic7, logic8]
    logic3 = combined_logic.count(True) >= 2
    # Type B
    lofic5 = program_type.count("B") != 0
    logic8 = df["Repeat Finding"].values.tolist().count("Y") >= 1
    logic9 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic10 = df["QCosts"].values.tolist().count("Y") >= 1
    logic11 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    logic12 = df["Multiple Grantors"].values.tolist().count("Y") != 0
    return all([logic1, logic2, logic4, logic3]) or (
        logic5 and any([logic8, logic9, logic10, logic11, logic12])
    )


# risk equals 95


def equal_to_95(df, idx, question_dict, print_values=False):
    import re

    df.fillna(" ", inplace=True)
    df = df[df["Grant ID"] == idx]
    df2 = df["Related Federal Agencies"]
    df2 = df["Major Program"]
    program_type = df2.values.tolist()
    logic1 = program_type.count("B") >= 1
    logic5 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic6 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic7 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    next_logic = [logic7, logic5, logic6]
    logic2 = next_logic.count(True) >= 2
    return all([logic1, logic2])


def is_nan(x):
    try:
        return np.isnan(x)
    except Exception:
        False


def eval_question(question, question_dict, eval_df, grant_id):
    req_question = question_dict[question]
    eval_df = eval_df[eval_df["Grant ID"] == grant_id]
    # ******* Risk 1 *******
    field_1 = eval_df[req_question["field_1"]].tolist()
    flag = True
    for i in field_1:
        if i == 0 or is_nan(i):
            flag = False
        else:
            if type(i) == list:
                for j in i:
                    flag = any(ele in j.lower() for ele in req_question["keywords"])
            elif type(i) == str:
                flag = any(ele in i.lower() for ele in req_question["keywords"])
        if flag:
            break
    field_1_risk = flag
    # ******* Risk 2 *******
    if req_question["field_2"] != "":
        field_2 = eval_df[req_question["field_2"]].tolist()
        flag = True
        for i in field_2:
            if i == 0 or is_nan(i):
                flag = False
            else:
                if type(i) == list:
                    for j in i:
                        flag = any(ele in j.lower() for ele in req_question["keywords"])
                elif type(i) == str:
                    flag = any(ele in i.lower() for ele in req_question["keywords"])

            if flag:
                break
        field_2_risk = flag
    else:
        field_2_risk = False
    # ******* Risk 3 *******
    if req_question["field_3"] != "":
        field_3 = eval_df[req_question["field_3"]].tolist()
        flag = True
        for i in field_3:
            if i == 0 or is_nan(i):
                flag = False
            else:
                if type(i) == list:
                    for j in i:
                        flag = any(ele in j.lower() for ele in req_question["keywords"])
                elif type(i) == str:
                    flag = any(ele in i.lower() for ele in req_question["keywords"])
            if flag:
                break
        field_3_risk = flag
    else:
        field_3_risk = False
    return any([field_1_risk, field_2_risk, field_3_risk])


def answer_to_ai_question(df):
    qdf = pd.read_excel(
        "Project Grant Risk Determination V2.1.xlsx",
        sheet_name="AI Question Matrix",
        engine="openpyxl",
    )
    qdf.columns = qdf.loc[0]
    qdf = qdf.loc[1:]
    question_value = {}
    questions = []
    for idx, row in qdf.iterrows():
        keywords = row[4:].values.tolist()
        keywords_req = [i.lower().strip() for i in keywords if not is_nan(i)]
        questions.append(row[1])
        question_value[row[1]] = {
            "field_1": row[2],
            "field_2": row[3] if not is_nan(row[3]) else "",
            "field_3": row[4] if not is_nan(row[4]) else "",
            "keywords": keywords_req,
        }
    idx = df["Grant ID"].tolist()[0]
    questions = qdf["Question"].tolist()
    questions_output = []
    question_dict = question_value
    for question in questions:
        if eval_question(question, question_dict, df, idx):
            questions_output.append(question.strip())
    return questions_output


def find_risk(df):
    qdf = pd.read_excel(
        "Project Grant Risk Determination V2.1.xlsx",
        sheet_name="AI Question Matrix",
        engine="openpyxl",
    )
    qdf.columns = qdf.loc[0]
    qdf = qdf.loc[1:]
    question_value = {}
    questions = []
    for idx, row in qdf.iterrows():
        keywords = row[4:].values.tolist()
        keywords_req = [i.lower().strip() for i in keywords if not is_nan(i)]
        questions.append(row[1])
        question_value[row[1]] = {
            "field_1": row[2],
            "field_2": row[3] if not is_nan(row[3]) else "",
            "field_3": row[4] if not is_nan(row[4]) else "",
            "keywords": keywords_req,
        }
    # print(df["Grant ID"])
    i = df["Grant ID"]
    if equal_to_95(df, i, question_value):
        return "95"
    if equal_to_90(df, i, question_value):
        return "90"
    if equal_to_80(df, i, question_value):
        return "80"
    if equal_to_70(df, i, question_value):
        return "70"
    if equal_to_60(df, i, question_value):
        return "60"
    if equal_to_50(df, i, question_value):
        return "50"
    if equal_to_40(df, i, question_value):
        return "40"
    if equal_to_30(df, i, question_value):
        return "30"
    if equal_to_20(df, i, question_value):
        return "20"
    if equal_to_ten(df, i, question_value):
        return "10"
    else:
        return "5"


def date_value(datestring):
    import datetime

    today = datetime.datetime.combine(datetime.date.today(), datetime.time(0, 0))
    dt = datetime.datetime.strptime(datestring, "%d %b %Y")
    return dt < today


def find_intervention(df):
    qdf = pd.read_excel(
        "Project Grant Risk Determination V2.1.xlsx",
        sheet_name="AI Question Matrix",
        engine="openpyxl",
    )
    qdf.columns = qdf.loc[0]
    qdf = qdf.loc[1:]
    value = find_risk(df)

    if value == False:
        return "No intervention"
    try:
        sub_recipent_exists = (
            len(
                [
                    i
                    for i in df["No. of Sub recipients"]
                    .drop_duplicates()
                    .values.tolist()
                    if str(i) == "1"
                ]
            )
            != 0
        )
    except:
        sub_recipent_exists = False
    multiple_grantor = df["Multiple Grantors"].values.tolist().count("Y") != 0
    material_weakness = df["Material Weakness"].values.tolist().count("Y") != 0
    if value == "40":
        if sub_recipent_exists:
            return [3]
        elif multiple_grantor and material_weakness:
            return [2]
        else:
            return [1]
    elif value == "50":
        if sub_recipent_exists:
            return [3]
        elif multiple_grantor and material_weakness:
            return [2]
        else:
            return [1]
    elif value == "60":
        if df["Action status"].values.tolist()[-1] == "Pending" and date_value(
            df["Action Due Date"].values.tolist()[-1]
        ):
            return [5, 6]
        elif sub_recipent_exists:
            return [3]
        elif multiple_grantor and material_weakness:
            return [2]
        else:
            return [1]
    elif value == "70":
        if df["Action status"].values.tolist()[-1] == "Pending" and date_value(
            df["Action Due Date"].values.tolist()[-1]
        ):
            return [7, 5, 6]
        elif sub_recipent_exists:
            return [7, 3]
        else:
            return [7, 1]
    elif value == "80":
        if df["Action status"].values.tolist()[-1] == "Pending" and date_value(
            df["Action Due Date"].values.tolist()[-1]
        ):
            return [8, 5, 6]
        elif sub_recipent_exists:
            return [8, 3, 4]
        elif multiple_grantor and material_weakness:
            return [8, 2]
        else:
            return [8, 1]
    elif value == "90":
        if df["Action status"].values.tolist()[-1] == "Pending" and date_value(
            df["Action Due Date"].values.tolist()[-1]
        ):
            return [5, 6]
        elif sub_recipent_exists:
            return [3, 4]
        elif multiple_grantor and material_weakness:
            return 2
        else:
            return 1
    elif value == "95":
        if df["Action status"].values.tolist()[-1] == "Pending" and date_value(
            df["Action Due Date"].values.tolist()[-1]
        ):
            return [9, 5, 6]
        elif sub_recipent_exists:
            return [9, 3, 4]
        else:
            return [1, 9]
    else:
        return 1


#         print(sub_recipent_exists)


#     return df2


def callout_risk(df, print_values=False):
    import re

    print(df)
    logic1 = df["Material Weakness"].values.tolist().count("Y") >= 1
    logic2 = df["Significant Deficiency"].values.tolist().count("Y") >= 1
    logic3 = df["Repeat Finding"].values.tolist().count("Y") >= 1
    logic4 = df["QCosts"].values.tolist().count("Y") >= 1
    logic5 = df["Multiple Grantors"].values.tolist().count("Y") != 0
    logic6 = df["Payroll costs % of overall costs"].values.tolist().count("Y") >= 1
    try:
        sub_rec = list(
            map(
                int,
                [
                    re.sub("%", "", i)
                    for i in df["Sub recipient's share"].values.tolist()
                    if i != " "
                ],
            )
        )
        # Sub recip more than 50
        logic7 = False if sub_rec == [] else max(sub_rec) > 50
    except:
        logic7 = False
    try:
        grant_exp = list(
            map(
                int,
                [i for i in df["Grant Expended"].values.flatten().tolist() if i != " "],
            )
        )
        own_fund = list(
            map(int, [i for i in df["Own Funds"].values.flatten().tolist() if i != " "])
        )
        # Own funds < 50%
        logic8 = (
            max(own_fund) > ((max(grant_exp) + max(own_fund)) / 50)
            if own_fund != [] and grant_exp != []
            else False
        )
    except:
        logic8 = False
    logic9 = df["Other non Compliance"].values.tolist().count("Y") != 0
    logic10 = len(set(df["Opinion on Audit Findings"].values.tolist())) <= 1
    logic11 = "NIH" not in df.values.tolist()
    logic12 = bool(
        set(["A", "B", "C"])
        & set(df["Type of Audit Compliance Requirements"].values.tolist())
    )
    logic13 = bool(
        set(["A", "B", "C"])
        & set(df["Type of Audit Compliance Requirements"].values.tolist())
    )

    no_sub_rec = list(
        map(
            int,
            [i for i in df["No. of Sub recipients"].values.tolist() if type(i) is int],
        )
    )
    no_sub_rec = [0] if no_sub_rec == [] else no_sub_rec
    logic15 = max(no_sub_rec) > 1
    grant_exp = list(
        map(
            int, [i for i in df["Grant Expended"].values.flatten().tolist() if i != " "]
        )
    )
    own_fund = list(
        map(
            int, [i for i in df["Grant Expended"].values.flatten().tolist() if i != " "]
        )
    )
    logic16 = (
        max(own_fund) > ((max(grant_exp) + max(own_fund)) / 50)
        if own_fund != [] and grant_exp != []
        else True
    )
    risk_matrix = {
        "Material Weakness": logic1,
        "Significant Deficiency": logic2,
        "QCost": logic4,
        "Multiple Grantors": logic5,
        "Sub recip more than 50": logic7,
        "Change opinion of audit": logic10,
        "More than one Subrecipeint": logic15,
        "Less than 50% Own money": logic8,
        "Audit Compliance Requirements": logic13,
    }
    return [key for key, value in risk_matrix.items() if value == True]
