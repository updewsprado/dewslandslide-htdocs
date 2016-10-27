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
    fdate = sys.argv[2]
    tdate = sys.argv[3]
#    rsite = '1236'
    # set arbitrarily for now
#    fdate = "2015-04-25"
#    tdate = "2016-04-25"
    engine = create_engine('mysql+pymysql://updews:october50sites@127.0.0.1/senslopedb')
    query = "select * from senslopedb.%s where timestamp between '%s' and  '%s'" % (rsite , fdate, tdate)
    df = pd.io.sql.read_sql(query,engine)
    df.columns = ['ts','cumm','rval']
    df = df.set_index(['ts'])
    df = df["rval"].astype(float)
    df = df[df>= 0]
    df = df.resample('15Min', how = "sum")
    dfs = pd.rolling_sum(df,96,min_periods=1)
    dfs1 = pd.rolling_sum(df,288,min_periods=1)
    dfs = dfs[dfs>=0]
    dfs1 = dfs1[dfs1>=0]
    dfa = pd.DataFrame({"rval":df,"cumm":dfs,"hrs72":dfs1})
    dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
    dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
    print dfajson
    
getDF();