import os
import sys
import time
from datetime import datetime
import pandas as pd
import vcdgen as vcd
import querySenslopeDb as qs

    
def getDF():

        site = sys.argv[1]
        fdate = sys.argv[2]
        tdate = sys.argv[3]
        df= vcd.colpos(colname=site, endTS=tdate, startTS=fdate, day_interval=1, fixpoint='bottom')
        print df
    
getDF();