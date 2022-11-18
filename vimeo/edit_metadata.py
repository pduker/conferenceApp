import vimeo
import ast
import csv
import os
import time

cwd = os.getcwd()

with open(os.path.join(cwd,'vimeo/vimeo_api.py')) as info_file:
    api_info = ast.literal_eval(info_file.read())
info_file.close()

values = []

with open(os.path.join(cwd,'vimeo/updater.tsv')) as tsv_file:
    tsv_reader = csv.reader(tsv_file, delimiter='\t')
    for i, row in enumerate(tsv_reader):
        if i == 0:
            headers = row
        else:
            value_dict = {}
            for j, field in enumerate(headers):
                value_dict[field] = row[j]
            values.append(value_dict)
tsv_file.close()


client = vimeo.VimeoClient(
    token = api_info['access_token'],
    key = api_info['client_id'],
    secret = api_info['client_secret']
)

for file in values:
    uri = '/videos/%s' % file['video_id']
    metadata = {
        'name': file['name'],
        'description': file['description']
    }
    
    client.patch(uri, data=metadata)
    time.sleep(5)