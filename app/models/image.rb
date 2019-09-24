class Image < ApplicationRecord
  has_many :characters
  has_many :best_scores
end
