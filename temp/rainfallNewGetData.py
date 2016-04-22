import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
import requests
    
def getDF():

    rsite = sys.argv[1]
    
    # set arbitrarily for now
    fdate = "2015-03-01"
    
    # url = "http://weather.asti.dost.gov.ph/home/index.php/api/data/%s/from/%s/to/%s" % (rsite,fdate,tdate)
    # r = requests.get(url)

    # df = pd.DataFrame(r.json()["data"])
    # df = df.set_index(['dateTimeRead'])
    # df.index = pd.to_datetime(df.index)

    engine = create_engine('mysql+mysqldb://updews:october50sites@127.0.0.1/senslopedb')

    #Changed date difference is 1 day or 24 hours
    query = "select timestamp, rain from senslopedb.%s where timestamp >= '%s'" % (rsite, fdate)

    df = pd.io.sql.read_sql(query,engine)
    df.columns = ['ts','rain']
    df = df.set_index(['ts'])

    df = df["rain"].astype(float)
    df = df.resample('15Min').fillna(0.00)
    # 24 Hours * (60 min / 1 Hour) * (1 sample / 15 min) = 96 samples
    dfs = pd.rolling_sum(df,96)
    dfa = pd.DataFrame({"rval":df,"cumm":dfs})
    dfa = dfa.fillna(0)
    dfa = dfa[96:]
    
    dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
    #dfa = dfa.reset_index()
    dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
    print dfajson
    
getDF();