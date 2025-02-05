class BusStop < ApplicationRecord
    belongs_to :route, optional: true
end