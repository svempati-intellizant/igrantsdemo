from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS, cross_origin

import logging
import os
from shared import construct_table_from_xlsx
from shared import construct_table_from_xlsx
from shared import poc_api


load_dotenv()


absolute_log_path = os.getenv('ABSOLUTE_LOGS_PATH')
os.makedirs(absolute_log_path, exist_ok=True)
for handler in logging.root.handlers[:]:
    logging.root.removeHandler(handler)
logging.basicConfig(filename=absolute_log_path+"/audit.log",
                    format='%(asctime)s %(message)s',
                    filemode='w')


logger = logging.getLogger()
logger.setLevel(logging.INFO)
app = Flask(__name__)
cors = CORS(app)

# Fetch Tables and respective coloumns from Single Audit File
@app.route("/single-audit-save", methods=['POST'])
def fetch_tables_from_files():
    if request.method == "POST":
        logger.info(
            f'*******************Request from User to Convert Xlsx to JSON of Single Audit File*********************')
        
        file_path = request.get_json()['file_path']
        response_from_igrant_audit = jsonify(
            poc_api.pocApi(file_path))
        print(response_from_igrant_audit)
        if not response_from_igrant_audit:
            logger.info(
                f'*******************Request from User to Convert Xlsx to JSON of Single Audit File has been processed successfully*********************')
        else:
            logger.info(
                f'*******************Request from User to Convert Xlsx to JSON of Single Audit File has been processed successfully*********************')
        return response_from_igrant_audit

if __name__ == "__main__":
    if "PORT" in os.environ:
        app.run(host='0.0.0.0', port=os.environ["PORT"],debug=True)
    else:
        logging.info(f"Port number not set..")
