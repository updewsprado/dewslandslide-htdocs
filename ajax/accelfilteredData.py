import os
import sys
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../updews-pycodes/Analysis/'))
if not path in sys.path:
   sys.path.insert(1, path)
del path
from querySenslopeDb import *
import filterSensorData
import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
import requests
# import querySenslopeDb as qs
    
def getDF():
    site = sys.argv[1]
    fdate = sys.argv[2]
    tdate = sys.argv[3]
    mid = sys.argv[4]
    nodeid = sys.argv[5]
#    site = 'agbsb'
#    fdate = '2015-04-10'
#    tdate = '2016-11-10'
#    mid = '32'
#    nodeid = '1'
    engine = create_engine('mysql+pymysql://updews:october50sites@127.0.0.1/senslopedb')
    query = "SELECT timestamp,id,msgid,xvalue,yvalue,zvalue,batt FROM senslopedb.%s where id = '%s'and msgid ='%s' and timestamp between '%s ' and '%s'" % (site,nodeid,mid,fdate,tdate)
    df = pd.io.sql.read_sql(query,engine)
#    df.columns = ['ts','rain']
    df = df.set_index(['timestamp'])
    df= GetRawAccelData(siteid = site, fromTime = fdate, toTime = tdate,  maxnode = 40, msgid = int(mid), targetnode =  int(nodeid) , batt=1, returndb=True)
    df_filt = filterSensorData.applyFilters(df, orthof=True, rangef=True, outlierf=True)
    df_filt = df.set_index(['ts'])
    dfajson = df_filt.reset_index().to_json(orient='records',date_format='iso')
    dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
    print dfajson
#    print df
        
getDF();