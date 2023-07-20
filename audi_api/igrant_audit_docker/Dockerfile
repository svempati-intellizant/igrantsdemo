FROM ubuntu
WORKDIR /app
RUN apt-get update &&  apt-get install -y python3 && apt-get install -y python3-pip 
RUN DEBIAN_FRONTEND=noninteractive apt install -y tzdata
RUN apt-get install -y libsm6 libxext6 libxrender-dev libglib2.0-0 poppler-utils
RUN pip3 install virtualenv
RUN apt-get install -y less  iputils-ping  telnet
RUN virtualenv igrant_audit_api -p python3
RUN cd igrant_audit_api && . ./bin/activate
RUN pip3 install gunicorn
COPY ./requirements.txt /app/igrant_audit_api/
RUN mkdir -p /app/igrant_audit_api/shared
COPY ./shared /app/igrant_audit_api/shared
RUN pip3 install -r /app/igrant_audit_api/requirements.txt
COPY ./*.py /app/igrant_audit_api/
COPY .env /app/igrant_audit_api/
RUN mkdir -p /app/igrant_audit_api/logs
COPY ./logs /app/igrant_audit_api/shared
WORKDIR /app/igrant_audit_api/
RUN ls
CMD ["python3", "igrant_audit_api.py"]

