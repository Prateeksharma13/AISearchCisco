from flask import Flask, request, render_template
from nltk.corpus import wordnet
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import requests
import re
import json
from flask import jsonify


app = Flask(__name__)

stopwords = set(stopwords.words('english'))
file = open('products.txt')
products = []
for line in file.readlines():
    products.append(line.rstrip())
wrong_words = products + list(stopwords)



# @app.route('/')
# def hello():
#     return render_template('index.html')


@app.route('/', methods=['GET'])
def my_form_post():
    # s = request.form['text']
    # processed_text = text.upper()
    # return processed_text
    s = request.headers.get("q")
    syn = get_regex(s)
    s = "http://localhost:9200/cisco/_search?q="+syn
    # localhost:9200/cisco/_search?q=.(reset|change).(password).*
    r = requests.get(s)
    return jsonify(r['hits'])

def get_regex(s):
    product_names = []
    for product in products:
        if product in s:
            product_names.append(product)
            s = s.replace(product, '')
    s = s.lower()
    word_tokens = word_tokenize(s)
    filtered_sentence = [w for w in word_tokens if not w in wrong_words]
    synonym_dict = {}
    for w in word_tokens:
        if w not in stopwords:
            filtered_sentence.append(w)
    for word in filtered_sentence:
        synonyms = []
        for syn in wordnet.synsets(word):
            for l in syn.lemmas():
                synonyms.append(l.name())
        if word not in synonym_dict.keys():
            synonym_dict[word] = set(synonyms)
    pattern = list()
    for key, value in synonym_dict.items():
        if len(value) > 0:
            pattern.append("(" + "|".join(value) + ")")
    rex_ex = ".*" + ".*".join(pattern) + ".*"
    for product in product_names:
        rex_ex = product + ".*" + rex_ex + ".*"
    return rex_ex

if __name__ == "__main__":
    app.run(debug=True, threaded=True)
