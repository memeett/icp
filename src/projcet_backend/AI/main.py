import numpy as np
import tensorflow as tf

print(tf.__version__)

users = ['Ryan', 'Danielle', 'Vijay', 'Chris']
jobs = ['Star Wars', 'The Dark Night', 'Shrek', 'The Incredibles', 'Blew', 'Memento']
features = ['Action', 'Sci-Fi', 'Comedy', 'Cartoon', 'Drama']

num_users = len(users)
num_jobs = len(jobs)
num_feats = len(features)

users_jobs = tf.constant([
    [4, 6, 8, 0, 0, 0],
    [0, 0, 10, 0, 8, 3],
    [0, 6, 0, 0, 3, 7],
    [10, 9, 0, 5, 0, 2]
], dtype=tf.float32)

jobs_feats = tf.constant([
    [1, 1, 0, 0, 1],
    [1, 1, 0, 0, 0],
    [0, 0, 1, 1, 0],
    [1, 0, 1, 1, 0],
    [0, 0, 0, 0, 1],
    [1, 0, 0, 0, 1]
], dtype=tf.float32)

wgtd_feature_matrices = [tf.expand_dims(tf.transpose(users_jobs)[:, i], axis=1) * jobs_feats for i in range(num_users)]
users_jobs_feats = tf.stack(wgtd_feature_matrices)
users_jobs_feats_sums = tf.reduce_sum(users_jobs_feats, axis=1)
users_jobs_feats_totals = tf.reduce_sum(users_jobs_feats_sums, axis=1)

users_feats = tf.stack([users_jobs_feats_sums[i, :] / users_jobs_feats_totals[i] for i in range(num_users)], axis=0)

def find_user_top_feats(user_index):
    feats_ind = tf.math.top_k(users_feats[user_index], num_feats).indices
    return tf.gather(features, feats_ind)

users_topfeats = {users[i]: find_user_top_feats(i).numpy().tolist() for i in range(num_users)}
print(users_topfeats)

users_totalclicks = [tf.map_fn(lambda x: tf.tensordot(users_feats[i], x, axes=1), jobs_feats) for i in range(num_users)]
all_users_totalclicks = tf.stack(users_totalclicks)
all_users_totalclicks_new = tf.where(tf.equal(users_jobs, tf.zeros_like(users_jobs)), all_users_totalclicks, -np.inf * tf.ones_like(users_jobs))

def find_user_top_jobs(user_index, num_to_recommend):
    jobs_ind = tf.math.top_k(all_users_totalclicks_new[user_index], k=num_to_recommend).indices
    return tf.gather(jobs, jobs_ind)

num_to_recommend = tf.reduce_sum(tf.cast(tf.equal(users_jobs, tf.zeros_like(users_jobs)), dtype=tf.int32), axis=1)

user_topjobs = {users[i]: [x.decode('utf-8') for x in find_user_top_jobs(i, num_to_recommend[i].numpy()).numpy()] for i in range(num_users)}

print(user_topjobs)
