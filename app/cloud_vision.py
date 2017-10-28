from google.cloud import vision
from google.cloud.vision import types
from google.oauth2 import service_account

def get_doc_text_strings(content):
    # Using the service account file in THIS directory,
    # credentials are gathered
    credentials = service_account.Credentials.from_service_account_file(
        'Burlap-e1525e8d31c4.json')
    scoped_credentials = credentials.with_scopes(
        ['https://www.googleapis.com/auth/cloud-platform'])

    # Makes a client
    client = vision.ImageAnnotatorClient(credentials=scoped_credentials)
    # Creates a google.cloud.vision image
    image = types.Image(content=content)

    # Request the gathered data
    response = client.document_text_detection(image=image)
    document = response.full_text_annotation

    # Get all the words that were found in the image
    myList = []
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
        
