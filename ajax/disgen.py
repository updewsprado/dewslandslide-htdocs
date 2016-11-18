import os
import sys
import time
from datetime import datetime
import pandas as pd
import vcdgen as vcd
import querySenslopeDb as qs

    
def getDF():

        site = 'agbsb'
        tdate = "2016-06-09 15:00:00"
        df= vcd.displacement(site, endTS=tdate)
        print df
    
getDF();