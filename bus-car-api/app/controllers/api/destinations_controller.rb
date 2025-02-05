class Api::DestinationsController < ApplicationController
  before_action :set_destination, only: [:show, :update, :destroy]

  # GET /destinations
  def index
    @destinations = Destination.all
    render json: @destinations
  end

  # GET /destinations/:id
  def show
    render json: @destination
  end

  # POST /destinations
  def create
    @destination = Destination.new(destination_params)

    if @destination.save
      render json: @destination, status: :created, location: api_destination_url(@destination)
    else
      render json: @destination.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /destinations/:id
  def update
    if @destination.update(destination_params)
      render json: @destination
    else
      render json: @destination.errors, status: :unprocessable_entity
    end
  end

  # DELETE /destinations/:id
  def destroy
    @destination.destroy
    head :no_content
  end

  private

  # Set destination for show, update, and destroy
  def set_destination
    @destination = Destination.find(params[:id])
  end

  # Strong parameters for destination
  def destination_params
    params.require(:destination).permit(:lat, :lng, :route_id)
  end
end
