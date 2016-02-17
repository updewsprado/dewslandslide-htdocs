import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
    
def getDF():

    site = sys.argv[1]
    node = sys.argv[2]

    #time start
    timeStart = (dt.now()-td(2)).strftime("%y/%m/%d %H:%M:%S")
    timeEnd = (dt.now()).strftime("%y/%m/%d %H:%M:%S")
    timeTarget = (dt.now()-td(days=1,hours=6)).strftime("%y/%m/%d %H:%M:%S")
    #print "End Time: " + timeEnd + ", Target Time: " + timeTarget
    
    engine = create_engine('mysql+mysqldb://updews:october50sites@127.0.0.1/senslopedb_purged')

    #Changed date difference is 1 day or 24 hours
    query = "select timestamp, xvalue, yvalue, zvalue from senslopedb_purged.%s where id = %s and xvalue is not null and timestamp >= '%s'" % (site, node, timeTarget)
    #a = cur.execute(query)
    #.columns=['ts','id','x','y','z','m']
    df = pd.io.sql.read_sql(query,engine)
    df.columns = ['ts','x','y','z']
    df = df.set_index(['ts'])
    
    df2 = df.copy()
    dfa = []

    #Enable this for debugging
    #print df2

    df3 = df2.resample('30Min').fillna(method='pad')
    dfv = df3 - df3.shift(12) 

    if len(dfa) == 0:
        dfa = dfv.copy()
    else:
        dfa = dfa.append(dfv)
        
    dfa = dfa[pd.notnull(dfa.x)]
    #dfa = dfa[pd.date_range(dfa.index[40], dfa.index[60])]
    #print dfa
    
    dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
    #dfa = dfa.reset_index()
    dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
    print dfajson
    
getDF();
