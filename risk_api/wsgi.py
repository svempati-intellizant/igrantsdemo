import os
from app import app
from dotenv import load_dotenv

load_dotenv(".env")


if __name__ == "__main__":
    app.run("0.0.0.0", port=os.environ["PORT"], debug=True)
