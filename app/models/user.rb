class User < ApplicationRecord
  has_many :images
  has_many :best_scores
end
