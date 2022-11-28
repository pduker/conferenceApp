#!/bin/bash

user=''
hostname=''
target_dir=''
loc='tmp/supp_materials/unsent'

scp $loc/* $user@$hostname:$target_dir

mv $loc/* tmp/supp_materials/sent