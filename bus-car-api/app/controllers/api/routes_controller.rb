class Api::RoutesController < ApplicationController
  before_action :set_route, only: [:show, :update, :destroy]

  # GET /api/routes
  def index
    @routes = Route.all
    render json: @routes
  end

  # GET /api/routes/:id
  def show
    locations = @route.locations.select(:latitude, :longitude)
    render json: { route: @route, locations: locations }
  end

  # POST /api/routes
  def create
    @route = Route.new(route_params)
    if @route.save
      render json: @route, status: :created
    else
      render json: @route.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/routes/:id
  def update
    if @route.update(route_params)
      render json: @route
    else
      render json: @route.errors, status: :unprocessable_entity
    end
  end

  # DELETE /api/routes/:id
  def destroy
    @route.destroy
    head :no_content
  end

  private

  # Set route for the actions
  def set_route
    @route = Route.find(params[:id])
  end

  # Permit only the allowed parameters for route
  def route_params
    params.require(:route).permit(:name, :waypoints)
  end
end
