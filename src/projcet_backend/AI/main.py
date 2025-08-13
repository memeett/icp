import numpy as np
import pandas as pd
from flask import Flask, jsonify, request
from flask_cors import CORS
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.neighbors import NearestNeighbors

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "https://localhost:3000"}})

@app.route('/getRecommendation', methods=['POST'])
def getRecomendationListJob():
    if not request.is_json:
        return jsonify({"error": "Request must be JSON"}), 415

    data = request.get_json()
    features = data.get('jobTags')
    list_jobs = data.get('listJobs')
    list_user_clickeds = data.get('listUserClickeds')

    user_clicks = pd.DataFrame(list_user_clickeds)
    jobs = pd.DataFrame(list_jobs)

    required_cols = {'userId', 'jobId', 'counter'}
    if not required_cols.issubset(user_clicks.columns):
        return jsonify({"error": "Missing required columns in user clicks data"}), 400

    user_clicks['counter'] = pd.to_numeric(user_clicks['counter'], errors='coerce')

    current_user_id = user_clicks['userId'].iloc[0]
    user_clicked_jobs = set(user_clicks[user_clicks['userId'] == current_user_id]['jobId'])

    jobs['features'] = jobs['jobTags'].apply(
        lambda x: ' '.join([tag['jobCategoryName'] for tag in x])
    )

    vectorizer = TfidfVectorizer()
    job_feature_matrix = vectorizer.fit_transform(jobs['features'])

    nn = NearestNeighbors(metric='cosine', algorithm='brute')
    nn.fit(job_feature_matrix)

    def recommend_jobs(user_clicked_jobs, top_n=5):
        clicked_indices = jobs[jobs['id'].isin(user_clicked_jobs)].index.tolist()
        if not clicked_indices:
            return []

        distances, indices = nn.kneighbors(job_feature_matrix[clicked_indices], n_neighbors=top_n + len(clicked_indices))

        all_indices = set(indices.flatten()) - set(clicked_indices)
        recommended_jobs = jobs.iloc[list(all_indices)].head(top_n).to_dict(orient='records')
        return recommended_jobs

    recommendations = recommend_jobs(user_clicked_jobs)

    return jsonify({
        "message": "Success",
        "top_jobs": recommendations
    })

if __name__ == '__main__':
    app.run(port=5001, debug=True, use_reloader=True)
