import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
import requests
import querySenslopeDb as qs
    
def downloadRainfallNOAH(rsite, fdate, tdate):   
    url = "http://weather.asti.dost.gov.ph/home/index.php/api/data/%s/from/%s/to/%s" % (rsite,fdate,tdate)
    r = requests.get(url)

    df = pd.DataFrame(r.json()["data"])

    try:
        df = df.set_index(['dateTimeRead'])
        df.index = pd.to_datetime(df.index)
        df = df["rain_value"].astype(float)
        df = df.resample('15Min').fillna(0.00)
        dfs = pd.rolling_sum(df,96)
        dfa = pd.DataFrame({"rain":df,"cummulative":dfs})
        dfa = dfa.fillna(0)
        dfa = dfa[96:]
        
        dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
        #dfa = dfa.reset_index()
        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
        print dfajson

    except:
        df = 0;
    
def getRainfallNOAHcmd():
    #first argument is the rain gauge id
    rsite = sys.argv[1]
    
    # adjust fdate to start 1 day later
    fdate = (pd.to_datetime(sys.argv[2]) - td(1)).strftime("%Y-%m-%d")
    
    tdate = sys.argv[3]

    #download rainfall data from the NOAH website
    downloadRainfallNOAH(rsite, fdate, tdate)

 
def doesNOAHTableExist(noahid):
    table_name = "rain_noah_%s" % (noahid)
    exists = qs.DoesTableExist(table_name)

    if exists:
        print table_name + " Exists!"
    else:
        print table_name + "DOES NOT exist..."
    
    return exists
    
def updateNOAHSingleTable(noahid):
    #check if table "rain_noah_" + "noahid" exists already
    if doesNOAHTableExist(noahid) == False:
        #Create table for noahid before proceeding with the download
        pass
    
    #TODO: find the latest timestamp for noahid
    #TODO: generate start time and end time    
    #TODO: download data for noahid
    #TODO: insert the new data on the noahid table
    
def updateNOAHTables():
    #get the list of rainfall NOAH rain gauge IDs
    dfRain = qs.GetRainNOAHList()
    
    for noahid in dfRain:
        updateNOAHSingleTable(noahid)


updateNOAHTables()
