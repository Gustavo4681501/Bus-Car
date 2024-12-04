class Api::LocationsController < ApplicationController
  before_action :set_location, only: [:show, :update, :destroy]

  def index
    @locations = Location.all
    render json: @locations
  end

  def show
    render json: @location
  end

  # GET /api/locations/user/:user_id
  def show_by_user_id
    location = Location.find_by(user_id: params[:user_id])
    if location
      render json: location
    else
      render json: { error: 'Location not found' }, status: :not_found
    end
  end

  # GET /api/locations/route/:route_id
  def show_by_route_id
    locations = Location.where(route_id: params[:route_id])
    if locations.any?
      render json: locations
    else
      render json: { error: 'No locations found for this route' }, status: :not_found
    end
  end

  # POST /api/locations
  def create
    location = Location.new(location_params)
    if location.save
      render json: location, status: :created
    else
      render json: location.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /locations/1
  def update
    if @location.update(location_params)
      render json: @location
    else
      render json: @location.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/locations/:user_id
  def destroy
    if @location
      @location.destroy
      render json: { message: 'Location deleted successfully' }, status: :ok
    else
      render json: { error: 'Location not found' }, status: :not_found
    end
  end

  def update_by_user
    user = User.find(params[:user_id])
    location = user.location

    if location.update(location_params)
      render json: location
    else
      render json: { error: 'Unable to update location' }, status: :unprocessable_entity
    end
  end

  private

  def set_location
    @location = Location.find_by(user_id: params[:user_id])
    render json: { error: 'Location not found' }, status: :not_found unless @location
  end

  def location_params
    params.require(:location).permit(:user_id, :latitude, :longitude, :route_id)
  end
end
