class Location < ApplicationRecord
  belongs_to :user

  belongs_to :route, optional: true
  
  validates :latitude, :longitude, presence: true
  validates :user_id, uniqueness: true
end
