import vimeo
import ast
import csv
import os
import time

cwd = os.getcwd()

with open(os.path.join(cwd,'src/vimeo_api.py')) as info_file:
    api_info = ast.literal_eval(info_file.read())
info_file.close()

values = []

with open(os.path.join(cwd,'tmp/uploader.csv')) as csv_file:
    csv_reader = csv.reader(csv_file)
    for i, row in enumerate(csv_reader):
        if i == 0:
            headers = row
        else:
            value_dict = {}
            for j, field in enumerate(headers):
                value_dict[field] = row[j]
            values.append(value_dict)


client = vimeo.VimeoClient(
    token = api_info['access_token'],
    key = api_info['client_id'],
    secret = api_info['client_secret']
)

for file in values:
    filepath = os.path.join(cwd,'tmp/videos/%s' % file['filename'])
    file_size = os.stat(filepath).st_size
    metadata = {
        'name': file['name'],
        'description': file['description']
    }

    uri = client.upload(filepath, data=metadata)

    response = client.get(uri + '?fields=transcode.status').json()

    while response['transcode']['status'] == 'in_progress':
        time.sleep(15)
        response = client.get(uri + '?fields=transcode.status').json()
        print(response['transcode']['status'])

    if response['transcode']['status'] != 'complete':
        print('There was an error with uploading %s' % file['name'])
    else:
        print('%s was successfully uploaded' % file['name'])