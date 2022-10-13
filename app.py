import json
import os
from flask import Flask, request as req, send_file
from werkzeug.utils import secure_filename
from flask_cors import CORS, cross_origin
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import statsmodels.api as sm
from pandas.tseries.offsets import DateOffset

app = Flask(__name__)
cors = CORS(app)

fileName = ""


@app.post("/predict")
@cross_origin()
def predict():
    # string = req.get_data('period').decode('utf-8')
    # data = json.loads(string)
    f = req.files['file']
    f.save(secure_filename(f.filename))
    fileName = os.path.abspath(f.filename)
    global df
    df = pd.read_csv(fileName)
    return {
        "request": "Sucess"
    }


@app.post("/period")
def period():
    period = req.json['period']
    df.columns = ["Date", "Sales"]
    df.drop(106, axis=0, inplace=True)
    df.drop(105, axis=0, inplace=True)
    df['Date'] = pd.to_datetime(df['Date'])
    df.set_index('Date', inplace=True)
    df['Sales First Difference'] = df['Sales'] - df['Sales'].shift(1)
    df['Seasonal First Difference'] = df['Sales']-df['Sales'].shift(12)
    df['Seasonal First Difference'].dropna()
    print(df.shape[0])
    model = sm.tsa.statespace.SARIMAX(
        df['Sales'], order=(1, 1, 1), seasonal_order=(1, 1, 1, 12))
    results = model.fit()
    start_date = 104
    end_date = start_date+int(period)
    df['forecast'] = results.predict(
        start=start_date, end=end_date, dynamic=True)
    future_dates = [df.index[-1] + DateOffset(months=x)for x in range(0, 24)]
    future_datest_df = pd.DataFrame(index=future_dates[1:], columns=df.columns)
    future_df = pd.concat([df, future_datest_df])
    future_df['forecast'] = results.predict(
        start=start_date, end=end_date, dynamic=True)
    future_df[['Sales', 'forecast']].plot(figsize=(12, 8))
    future_df.to_csv('Final.csv')
    global fileName 
    fileName= "Plot1.png"
    plt.legend(["Sales", "Forcast for the {} days".format(period)])
    plt.savefig(fileName)

    return {
        "Message": "Success"
    }


@app.get('/results')
def results():
    return send_file(fileName)


app.run()
