import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
import requests

def getDF():
        gsite = sys.argv[1]
        measD = "1000"
        fdate = "2013-04-25"
        engine = create_engine('mysql+pymysql://root:senslope@127.0.0.1/senslopedb')
        query = "SELECT timestamp,crack_id,meas FROM senslopedb.gndmeas where timestamp >'%s' and site_id ='%s' and meas <= '%s' order by site_id asc"%(fdate,gsite,measD) 
        df = pd.io.sql.read_sql(query,engine)
        df.columns = ['ts','crack_id','meas']
        dfa= df.pivot('ts','crack_id','meas')
        #print dfa
        dfa = dfa.fillna(method='ffill')
        dfajson = dfa.reset_index().to_json(orient='records',date_format='iso')
        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
        # 
        print dfajson



getDF();
