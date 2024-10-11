class CreateLocations < ActiveRecord::Migration[7.1]
  def change
    create_table :locations do |t|
      t.bigint :user_id, null: false
      t.float :latitude
      t.float :longitude
      t.bigint :route_id 

      t.timestamps
    end

   
  end
end
