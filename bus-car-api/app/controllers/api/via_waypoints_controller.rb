class Api::ViaWaypointsController < ApplicationController
  before_action :set_via_waypoint, only: [:show, :update, :destroy]

  # GET /via_waypoints
  def index
    @via_waypoints = ViaWaypoint.all
    render json: @via_waypoints
  end

  # GET /via_waypoints/:id
  def show
    render json: @via_waypoint
  end

  # POST /via_waypoints
  def create
    @via_waypoint = ViaWaypoint.new(via_waypoint_params)

    if @via_waypoint.save
      render json: @via_waypoint, status: :created, location: api_via_waypoint_url(@via_waypoint)
    else
      render json: @via_waypoint.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /via_waypoints/:id
  def update
    if @via_waypoint.update(via_waypoint_params)
      render json: @via_waypoint
    else
      render json: @via_waypoint.errors, status: :unprocessable_entity
    end
  end

  # DELETE /via_waypoints/:id
  def destroy
    @via_waypoint.destroy
    head :no_content
  end

  private

  # Set via_waypoint for show, update, and destroy
  def set_via_waypoint
    @via_waypoint = ViaWaypoint.find(params[:id])
  end

  # Strong parameters for via_waypoint
  def via_waypoint_params
    params.require(:via_waypoint).permit(:lat, :lng, :route_id)  
  end
end
