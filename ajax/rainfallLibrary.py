import pandas as pd
import numpy as np
from datetime import timedelta as td
from datetime import datetime as dt
import sqlalchemy
from sqlalchemy import create_engine
import sys
import requests
import querySenslopeDb as qs
    
#download the NOAH Rainfall data directly from ASTI
def downloadRainfallNOAH(rsite, fdate, tdate):   
    url = "http://weather.asti.dost.gov.ph/home/index.php/api/data/%s/from/%s/to/%s" % (rsite,fdate,tdate)
    r = requests.get(url)

    try:
        df = pd.DataFrame(r.json()["data"])
    except TypeError:
        print "    No device with id of %s" % rsite
        return pd.DataFrame()

    try:
        df = df.set_index(['dateTimeRead'])
        df.index = pd.to_datetime(df.index)
        df = df["rain_value"].astype(float)
        df = df.resample('15Min').fillna(0.00)
        dfs = pd.rolling_sum(df,96)
        dfa = pd.DataFrame({"rval":df,"cumm":dfs})
        dfa = dfa.fillna(0)
        dfa = dfa[96:]
        
        #rename the "index" into "timestamp"
        dfa.index.names = ["timestamp"]
        return dfa
        
    except:
        return pd.DataFrame()
        
def downloadRainfallNOAHJson(rsite, fdate, tdate):
    dfa = downloadRainfallNOAH(rsite, fdate, tdate)
    
    if dfa.empty: 
        return pd.DataFrame()
    else:        
        
        dfajson = dfa.reset_index().to_json(orient="records",date_format='iso')
        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
        #print dfajson
        return dfajson
        
#insert the newly downloaded data to the database
def updateRainfallNOAHTableData(rsite, fdate, tdate):
    noahData = downloadRainfallNOAH(rsite, fdate, tdate)
    #print noahData
    
    if noahData.empty: 
        print "    no data..."
        #TODO: insert an entry with values: [timestamp,-1,-1] as a marker
        #   for the next time it is used
    else:        
        table_name = "rain_noah_%s" % (rsite)
        
        #Insert the new data on the noahid table
        qs.PushDBDataFrame(noahData, table_name) 
    
    
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
    
    #Find the latest timestamp for noahid (which is also the start date)
    table_name = "rain_noah_%s" % (noahid)
    latestTS = qs.GetLatestTimestamp2(table_name)    
    
    if latestTS == '':
        #assign a starting date if table is currently empty
        latestTS = "2014-01-01 00:00:00"
        pass

    latestTS = latestTS.strftime("%Y-%m-%d")
    print "    Start timestamp: " + latestTS
    
    #Generate start end time    
    endTS = (pd.to_datetime(latestTS) + td(50)).strftime("%Y-%m-%d")
    print "    End timestamp: %s" % (endTS)
    
    #Download data for noahid
    updateRainfallNOAHTableData(noahid, latestTS, endTS)    

    
def updateNOAHTables():
    #get the list of rainfall NOAH rain gauge IDs
    dfRain = qs.GetRainNOAHList()
    
    ctr = 0
    for noahid in dfRain:
        if ctr > 15:
            updateNOAHSingleTable(noahid)
            
        ctr = ctr + 1

updateNOAHTables()
#downloadRainfallNOAH(557, "2015-04-12", "2015-06-01")    
