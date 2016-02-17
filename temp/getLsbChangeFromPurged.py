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
    
    engine = create_engine('mysql+mysqldb://updews:october50sites@127.0.0.1/senslopedb_purged')

    #query = "select timestamp, xvalue, yvalue, zvalue from senslopedb_purged.%s where id = %s and timestamp > '%s'" % (site, node, (dt.now()-td(30)).strftime("%y/%m/%d %H:%M:%S"))
	
    #Changed date difference from 30 to 100
    query = "select timestamp, xvalue, yvalue, zvalue from senslopedb_purged.%s where id = %s and timestamp > '%s'" % (site, node, (dt.now()-td(100)).strftime("%y/%m/%d %H:%M:%S"))

    df = pd.io.sql.read_sql(query,engine)
    df.columns = ['ts','x','y','z']
    df = df.set_index(['ts'])
    
    df2 = df.copy()
    dfa = []

    df3 = df2.resample('30Min').fillna(method='pad')
    dfv = df3 - df3.shift(12) 

    if len(dfa) == 0:
        dfa = dfv.copy()
    else:
        dfa = dfa.append(dfv)
        
    dfa = dfa[pd.notnull(dfa.x)]
    
    dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
    #dfa = dfa.reset_index()
    dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
    print dfajson
    
getDF();
