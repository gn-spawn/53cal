export default class GomiCal {
  city_code: number;
  area_code: number;
  constructor(opts: {
    city: number,
    area: number
  }) {
    this.city_code = opts.city;
    this.area_code = opts.area;
  }
}
