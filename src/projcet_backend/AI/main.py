import numpy as np
import tensorflow as tf
from flask import Flask, jsonify, request
from flask_cors import CORS
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

print("TensorFlow version:", tf.__version__)

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://localhost:3000"}})

@app.route('/getRecommendation', methods=['POST'])
def getRecomendationListJob():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    print("Received data:", data)  

    features = data.get('jobTags')
    list_jobs = data.get('listJobs')
    list_user_clickeds = data.get('listUserClickeds')

    user_clicks = pd.DataFrame(list_user_clickeds)
    jobs = pd.DataFrame(list_jobs)

    print("User Clicks Columns:", user_clicks.columns)
    print("Jobs Columns:", jobs.columns)

    if 'userId' not in user_clicks.columns or 'jobId' not in user_clicks.columns or 'counter' not in user_clicks.columns:
        return jsonify({"error": "Missing required columns in user clicks data"}), 400

    user_clicks['counter'] = pd.to_numeric(user_clicks['counter'], errors='coerce')

    current_user_id = user_clicks['userId'].iloc[0]  
    user_clicked_jobs = user_clicks[user_clicks['userId'] == current_user_id]['jobId'].tolist()
    print("User Clicked Jobs:", user_clicked_jobs)  

    jobs['features'] = jobs['jobTags'].apply(lambda x: ' '.join([tag['jobCategoryName'] for tag in x]))
    print("Job Features:\n", jobs[['id', 'features']])  

    vectorizer = TfidfVectorizer()
    job_feature_matrix = vectorizer.fit_transform(jobs['features'])
    print("Job Feature Matrix Shape:", job_feature_matrix.shape) 

    job_similarity = cosine_similarity(job_feature_matrix)
    print("Job Similarity Matrix Shape:", job_similarity.shape)  

    def recommend_jobs(user_clicked_jobs, job_similarity, jobs, top_n=5):
        clicked_job_indices = jobs[jobs['id'].isin(user_clicked_jobs)].index.tolist()
        print("Clicked Job Indices:", clicked_job_indices)  

        job_scores = job_similarity[clicked_job_indices].mean(axis=0)
        print("Job Scores:", job_scores)  

        recommended_job_indices = np.argsort(job_scores)[::-1]
        print("Recommended Job Indices:", recommended_job_indices)  

        recommended_job_indices = [idx for idx in recommended_job_indices if idx not in clicked_job_indices]
        print("Filtered Recommended Job Indices:", recommended_job_indices)  

        top_job_indices = recommended_job_indices[:top_n]
        recommended_jobs = jobs.iloc[top_job_indices].to_dict(orient='records')
        return recommended_jobs

    recommendations = recommend_jobs(user_clicked_jobs, job_similarity, jobs)
    recommended_job_names = jobs[jobs['id'].isin(recommendations)]['jobName']
    print("Recommended Jobs:", recommended_job_names.tolist())  
    print(jobs[jobs['id'].isin(recommendations)])
    return jsonify({
        "message": "Success",
        "top_jobs": recommendations
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True, use_reloader=True)