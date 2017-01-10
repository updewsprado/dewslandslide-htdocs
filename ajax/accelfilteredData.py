import os
import sys
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../../updews-pycodes/Analysis/'))
if not path in sys.path:
   sys.path.insert(1, path)
del path
from querySenslopeDb import *
import filterSensorData
# import querySenslopeDb as qs
    
def getDF():
        site = sys.argv[1]
        fdate = sys.argv[2]
        tdate = sys.argv[3]
        mid = sys.argv[4]
        print mid
        nodeid = sys.argv[5]
        df= GetRawAccelData(siteid = site, fromTime = fdate, toTime = tdate,  maxnode = 40, msgid = int(mid), targetnode =  int(nodeid) , batt=1, returndb=True)
        df_filt = filterSensorData.applyFilters(df, orthof=True, rangef=True, outlierf=True)
        df_filt = df_filt.set_index(['ts'])
        dfajson = df_filt.reset_index().to_json(orient='records',date_format='iso')
        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
     
        print dfajson
        
getDF();