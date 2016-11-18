import os
import sys
import time
from datetime import datetime
import pandas as pd
import vcdgen as vcd
import querySenslopeDb as qs

    
def getDF():

        site = 'agbsb'
        fdate = "2016-05-01 00:00:00"
        tdate = "2016-06-09 15:00:00"
        df= vcd.velocity(site, tdate, fdate)
#        df = pd.DataFrame(df,columns=['raw'])
#        dfajson = df.reset_index().to_json(orient="records",date_format='iso')
#        dfajson = dfajson.replace("T"," ").replace("Z","").replace(".000","")
        print df
    
getDF();