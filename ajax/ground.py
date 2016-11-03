import os
import sys
import time
from datetime import datetime
import pandas as pd
import GroundDataAlertLibWithTrending as test
import querySenslopeDb as qs

    
def getDF():

        site = sys.argv[1]
        cid = sys.argv[2]
        df= test.GroundDataTrendingPlotJSON(site, cid, datetime.now())
        df = pd.DataFrame(df,columns=['raw'])
        dfajson = df.reset_index().to_json(orient="records",date_format='iso')
        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
        print dfajson
    
getDF();