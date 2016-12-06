
import os
import sys
import time
from datetime import datetime
import pandas as pd
#include the path of "Data Analysis" folder for the python scripts searching
path = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
if not path in sys.path:
    sys.path.insert(1,path)
del path    

#import Data Analysis/querySenslopeDb
import querySenslopeDb as qs

#import Velocity, Column Position and Displacement Generator Library
import vcdgen as vcd
start = datetime.now()
    
def getDF():

        site = sys.argv[1]
        fdate = sys.argv[2]
        tdate = sys.argv[3]
        df= vcd.vcdgen(site, tdate, fdate,1)

        print df
        print "runtime =", datetime.now() - start   
    
getDF();