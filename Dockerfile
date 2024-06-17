FROM python:3.10-alpine
ENV PYTHONUNBUFFERED=1

WORKDIR /mock
COPY requirements.txt .

RUN pip install -r requirements.txt

WORKDIR /mock
COPY . .

EXPOSE 8000

CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]