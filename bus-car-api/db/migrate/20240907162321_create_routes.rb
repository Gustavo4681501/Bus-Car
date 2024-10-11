class CreateRoutes < ActiveRecord::Migration[7.1]
  def change
    create_table :routes do |t|
      t.string :name
      t.string :origin       
      t.string :destination 
      t.json :via_waypoints
      t.json :bus_stops

      t.timestamps
    end
  end
end
