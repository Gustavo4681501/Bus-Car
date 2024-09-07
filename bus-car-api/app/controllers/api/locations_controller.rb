class Api::LocationsController < ApplicationController
  # before_action :authenticate_user!

  def index
    locations = Location.all
    render json: locations
  end

  def create
    user_id = params[:user_id]
    location = Location.new(location_params)
    location.user_id = user_id
    location.visible = true
    
    if location.save
      render json: location, status: :created
    else
      render json: { error: location.errors.full_messages }, status: :unprocessable_entity
    end
  end

  def destroy
    location = Location.find_by(user_id: params[:id])
    if location
      location.destroy
      render json: { message: 'Ubicación eliminada con éxito' }, status: :ok
    else
      render json: { error: 'Ubicación no encontrada' }, status: :not_found
    end
  end

  private

  def location_params
    params.require(:location).permit(:latitude, :longitude)
  end
end
