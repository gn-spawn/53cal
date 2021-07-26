import { parse, getYear, getMonth } from 'date-fns';
import got from 'got';
import cheerio from 'cheerio';
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

  /**
   * dateAndCategoryInMonth
   */
  public async dateAndCategoryInMonth(year: number, month: number) {
    let dateAndCategory: string[] = [];
    try {
      const request_url = `http://www.53cal.jp/areacalendar/?city=${this.city_code}&area=${this.area_code}&yy=${year}&mm=${month}`;
      const body = await (await got.get(request_url)).body;
      const $ = cheerio.load(body);
      $('.calbox td').filter((i, el) => $(el).find('img').length > 0).map((i, el) => {
        const imageSrc = $(el).find('img').attr('src');
        const day = (imageSrc?.match(/(\d+)/) || [])[1] || null;
        const key = `${year}-${month}-${day}`
        const value = $(el).find('a').attr('title') || null;
        let box: any = {};
        box[key] = value;
        dateAndCategory.push(box);
      })
      const cityName = $('#breadcrumbs a:last-child').text();
      const areaName = ($('#breadcrumbs').text().match(/＞\s([^＞]*)のクリーンカレンダー/) || [])[1] || null;

      var data = {
        meta: {
          city: this.city_code,
          area: this.area_code,
          cityName: cityName,
          areaName: areaName,
          link: request_url
        },
        result: dateAndCategory
      };
      return data
    } catch (error) {
      return error
    }
  }

  /**
   * whatDate
   */
  public async whatDate(dateStr: string) {
    const date = parse(dateStr, 'yyyy-MM-dd', new Date());
    const year = getYear(date);
    const month = getMonth(date);

    try {
      const dateAndCategory = await this.dateAndCategoryInMonth(year, month + 1)
      const value = dateAndCategory.result.filter((hash: any) => Object.keys(hash)[0] === dateStr).shift()
      console.log(value)
      const data = {
        meta: {
          city: this.city_code,
          area: this.area_code,
          cityName: dateAndCategory.meta.cityName,
          areaName: dateAndCategory.meta.areaName,
          link: dateAndCategory.meta.link
        },
        result: value
      };

      return data
    } catch (error) {
      return error
    }
  }
}
