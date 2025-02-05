class Destination < ApplicationRecord
    belongs_to :route, optional: true
end