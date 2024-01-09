import pandas as pd
from tqdm import tqdm
from sklearn.metrics.pairwise import cosine_similarity
from transformers import BertTokenizer, AutoModelForSequenceClassification
import torch
import numpy as np
from keras.preprocessing.sequence import pad_sequences


# Load BERT model and tokenizer
model_path = "bert-base-uncased"
tokenizer = BertTokenizer.from_pretrained(model_path, do_lower_case=True)
model = AutoModelForSequenceClassification.from_pretrained(model_path, output_attentions=False, output_hidden_states=True)

def create_vector_from_text(tokenizer, model, text, MAX_LEN=510):
    input_ids = tokenizer.encode(
        text,
        add_special_tokens=True,
        max_length=MAX_LEN,
        truncation=True  # Explicitly activate truncation
    )
    results = pad_sequences([input_ids], maxlen=MAX_LEN, dtype="long", truncating="post", padding="post")
    input_ids = results[0]
    attention_mask = [int(i > 0) for i in input_ids]
    input_ids = torch.tensor(input_ids)
    attention_mask = torch.tensor(attention_mask)
    input_ids = input_ids.unsqueeze(0)
    attention_mask = attention_mask.unsqueeze(0)
    model.eval()
    with torch.no_grad():
        logits, encoded_layers = model(input_ids=input_ids, token_type_ids=None, attention_mask=attention_mask,
                                       return_dict=False)
    layer_i = 12
    batch_i = 0
    token_i = 0
    vector = encoded_layers[layer_i][batch_i][token_i]
    vector = vector.detach().cpu().numpy()
    return vector

def process_document(text):
    text_vect = create_vector_from_text(tokenizer, model, text)
    text_vect = np.array(text_vect)
    text_vect = text_vect.reshape(1, -1)
    return text_vect

def calculate_similarity(query_text, reference_text):
    query_vect = process_document(query_text)
    reference_vect = process_document(reference_text)
    similarity_score = cosine_similarity(query_vect, reference_vect)[0][0]
    return similarity_score

def is_plagiarism(similarity_score, plagiarism_threshold):
    return similarity_score >= plagiarism_threshold

# Example usage
document1 = "In the emergency department, it is important to identify and prioritize who requires an urgent intervention in a short time. Triage helps recognize the urgency among patients. An accurate triage decision helps patients receive the emergency service in the most appropriate time. Various triage systems have been developed and verified to assist healthcare providers to make accurate triage decisions. The triage accuracy can represent the quality of emergency service, but there is a lack of review studies addressing this topic. Methods: A literature search was conducted in four electronic databases where \x91emergency nursing\x92 and \x91triage accuracy\x92 were used as keywords. Studies published from 2008 January to 2018 August were included as potential subjects. Nine studies were included in this review after the inclusion and exclusion criteria were applied. Results: Written case scenarios and retrospective review were commonly used to examine the triage accuracy. The triage accuracy from studies was in moderate level. The single-center studies which held better results than those from multi-center studies revealed the need of triage training and consistent training between emergency departments. Conclusions: Regular refresher triage training, collaboration between emergency departments and continuous monitoring were necessary to strengthen the use of triage systems and improve nurse\x92s triage performance."
document2 = "We present here SEMILAR, a SEMantic simILARity toolkit. SEMILAR implements a number of algorithms for assessing the semantic similarity between two texts. It is available as a Java library and as a Java standalone application offering GUI-based access to the implemented semantic similarity methods.Furthermore, it offers facilities for manual semantic similarity annotation by expertsthrough its component SEMILAT (a SEMantic simILarity Annotation Tool)."

plagiarism_threshold = 0.9
similarity_score = calculate_similarity(document1, document2)
plagiarism_decision = is_plagiarism(similarity_score, plagiarism_threshold)

print(f"Similarity Score: {similarity_score}")
print(f"Plagiarism Decision: {plagiarism_decision}")