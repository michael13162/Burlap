from google.cloud import vision
from google.cloud.vision import types
from google.oauth2 import service_account
from google.cloud.vision.feature import Feature
from google.cloud.vision.feature import FeatureTypes

def get_doc_text_strings(content):
    # Using the service account file in THIS directory,
    # credentials are gathered
    credentials = service_account.Credentials.from_service_account_file(
        'Burlap-e1525e8d31c4.json')
    scoped_credentials = credentials.with_scopes(
        ['https://www.googleapis.com/auth/cloud-platform'])

    # Makes a client
    client = vision.ImageAnnotatorClient(credentials=scoped_credentials)

    # Request the data for labels and doc_text
    annotations = client.annotate_image({
                'image': {
                    'content': content,
                },
                'features': [{
                    'type': vision.enums.Feature.Type.DOCUMENT_TEXT_DETECTION,
                }, {
                    'type': vision.enums.Feature.Type.LABEL_DETECTION,
                    }]
            })
    document = annotations.full_text_annotation
    labels = annotations.label_annotations
   
    myList = []
    for label in labels:
        myList.append(label.description)
        
    # Get all the words that were found in the image
    for page in document.pages:
        for block in page.blocks:
            block_words = []
            for paragraph in block.paragraphs:
                block_words.extend(paragraph.words)
            for word in block_words:
                addWord = '';
                for symbol in word.symbols:
                    addWord = addWord + symbol.text
                myList.append(addWord)
    return myList
        
