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

with open(os.path.join(cwd,'vimeo/uploader.tsv')) as tsv_file:
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

responses = []
for file in values:
    filepath = os.path.join(cwd,'vimeo/videos/%s' % file['filename'])
    file_size = os.stat(filepath).st_size
    metadata = {
        'name': file['name'],
        'description': file['description']
    }

    uri = client.upload(filepath, data=metadata)

    responses.append([uri, client.get(uri + '?fields=transcode.status').json()])


for i, response in enumerate(responses):
    while response[1]['transcode']['status'] == 'in_progress':
        time.sleep(15)
        response = [response[0], client.get(response[0] + '?fields=transcode.status').json()]
        print(response[1]['transcode']['status'])
        

    if response[1]['transcode']['status'] != 'complete':
        print('There was an error with uploading %s' % values[i]['name'])
    else:
        print('%s was successfully uploaded' % values[i]['name'])
