FROM python:3.7-slim
RUN apt-get update 
RUN pip3 install --upgrade pip
RUN apt install gcc -y
WORKDIR /app
COPY requirements.txt /app
RUN pip3 install -r requirements.txt
COPY . /app
EXPOSE 5002
ENV PYTHONIOENCODING utf-8
RUN pip3 install gunicorn
