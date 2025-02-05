class Api::BusStopsController < ApplicationController
  before_action :set_bus_stop, only: [:show, :update, :destroy]

  # GET /bus_stops
  def index
    @bus_stops = BusStop.all
    render json: @bus_stops
  end

  # GET /bus_stops/:id
  def show
    render json: @bus_stop
  end

  # POST /bus_stops
  def create
    @bus_stop = BusStop.new(bus_stop_params)

    if @bus_stop.save
      render json: @bus_stop, status: :created, location: api_bus_stop_url(@bus_stop)
    else
      render json: @bus_stop.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /bus_stops/:id
  def update
    if @bus_stop.update(bus_stop_params)
      render json: @bus_stop
    else
      render json: @bus_stop.errors, status: :unprocessable_entity
    end
  end

  # DELETE /bus_stops/:id
  def destroy
    @bus_stop.destroy
    head :no_content
  end

  private

  # Set bus_stop for show, update, and destroy
  def set_bus_stop
    @bus_stop = BusStop.find(params[:id])
  end

  # Strong parameters for bus_stop
  def bus_stop_params
    params.require(:bus_stop).permit(:lat, :lng, :route_id)  
  end
end
