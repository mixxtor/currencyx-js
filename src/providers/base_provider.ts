/**
 * Base Currency Provider
 * 
 * Abstract base class for all currency providers
 * Based on existing BaseCurrency from providers/currency/base.ts
 */

import type {
  CurrencyCode,
  ConversionResult,
  ExchangeRatesResult,
  HealthCheckResult,
  CurrencyInfo,
  ConvertParams,
  ExchangeRatesParams
} from '../types/index.js'
import type { CurrencyProviderContract } from '../contracts/currency_provider.js'

export abstract class BaseCurrencyProvider implements CurrencyProviderContract {
  /**
   * Provider name - must be implemented by subclasses
   */
  abstract readonly name: string

  /**
   * Base currency code. Default is 'USD'.
   */
  public base: CurrencyCode = 'USD'

  /**
   * List of currencies with detailed information
   * Based on existing currency list from providers/currency/base.ts
   */
  protected readonly currencyList: CurrencyInfo[] = [
    { code: 'AED', numeric_code: '784', name: 'United Arab Emirates dirham', symbol: 'د.إ', round: 1, decimal: 2, delimiter: '.', short_format: 'Dhs. {{amount}}', explicit_format: 'Dhs. {{amount}} AED', countries: ['AE'] },
    { code: 'AFN', numeric_code: '971', name: 'Afghan afghani', symbol: '؋', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}}؋', explicit_format: '{{amount}}؋ AFN', countries: ['AF'] },
    { code: 'ALL', numeric_code: '008', name: 'Albanian lek', symbol: 'Lek', round: 100, decimal: 2, delimiter: ',', short_format: 'Lek {{amount}}', explicit_format: 'Lek {{amount}} ALL', countries: ['AL'] },
    { code: 'AMD', numeric_code: '051', name: 'Armenian dram', symbol: '֏', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}} ֏', explicit_format: '{{amount}} AMD', countries: ['AM'] },
    { code: 'ANG', numeric_code: '532', name: 'Netherlands Antillean guilder', symbol: 'ƒ', round: 1, decimal: 2, delimiter: ',', short_format: 'ƒ{{amount}}', explicit_format: 'ƒ{{amount}} ANG', countries: ['CW', 'SX'] },
    { code: 'AOA', numeric_code: '973', name: 'Angolan kwanza', symbol: 'Kz', round: 100, decimal: 2, delimiter: ',', short_format: 'Kz{{amount}}', explicit_format: 'Kz{{amount}} AOA', countries: ['AO'] },
    { code: 'ARS', numeric_code: '032', name: 'Argentine peso', symbol: '$', round: 100, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: 'AR${{amount}}', countries: ['AR'] },
    { code: 'AUD', numeric_code: '036', name: 'Australian dollar', symbol: '$', round: 0.05, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'AU${{amount}}', countries: ['AU', 'CX', 'CC', 'HM', 'KI', 'NR', 'NF', 'TV'] },
    { code: 'AWG', numeric_code: '533', name: 'Aruban florin', symbol: 'ƒ', round: 0.05, decimal: 2, delimiter: '.', short_format: 'ƒ{{amount}}', explicit_format: 'ƒ{{amount}} AWG', countries: ['AW'] },
    { code: 'AZN', numeric_code: '944', name: 'Azerbaijani manat', symbol: '₼', round: 0.01, decimal: 2, delimiter: '.', short_format: '₼{{amount}}', explicit_format: '₼{{amount}} AZN', countries: ['AZ'] },
    { code: 'BAM', numeric_code: '977', name: 'Bosnia and Herzegovina convertible mark', symbol: 'КМ', round: 0.05, decimal: 2, delimiter: ',', short_format: 'КМ {{amount}}', explicit_format: 'КМ {{amount}} BAM', countries: ['BA'] },
    { code: 'BBD', numeric_code: '052', name: 'Barbados dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'Bds${{amount}}', countries: ['BB'] },
    { code: 'BDT', numeric_code: '050', name: 'Bangladeshi taka', symbol: '৳', round: 1, decimal: 2, delimiter: ',', short_format: '৳{{amount}}', explicit_format: '৳{{amount}} BDT', countries: ['BD'] },
    { code: 'BGN', numeric_code: '975', name: 'Bulgarian lev', symbol: 'лв', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} лв', explicit_format: '{{amount}} BGN', countries: ['BG'] },
    { code: 'BHD', numeric_code: '048', name: 'Bahraini dinar', symbol: '.د.ب', round: 0.005, decimal: 3, delimiter: '.', short_format: '{{amount}} BD', explicit_format: '{{amount}} BHD', countries: ['BH'] },
    { code: 'BIF', numeric_code: '108', name: 'Burundian franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} BIF', countries: ['BI'] },
    { code: 'BMD', numeric_code: '060', name: 'Bermudian dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'BD${{amount}}', countries: ['BM'] },
    { code: 'BND', numeric_code: '096', name: 'Brunei dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'B${{amount}}', countries: ['BN'] },
    { code: 'BOB', numeric_code: '068', name: 'Boliviano', symbol: 'Bs.', round: 0.01, decimal: 2, delimiter: ',', short_format: 'Bs. {{amount}}', explicit_format: 'Bs. {{amount}} BOB', countries: ['BO'] },
    { code: 'BRL', numeric_code: '986', name: 'Brazilian real', symbol: 'R$', round: 0.01, decimal: 2, delimiter: ',', short_format: 'R${{amount}}', explicit_format: 'R${{amount}} BRL', countries: ['BR'] },
    { code: 'BSD', numeric_code: '044', name: 'Bahamian dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'B${{amount}}', countries: ['BS'] },
    { code: 'BTN', numeric_code: '064', name: 'Bhutanese ngultrum', symbol: 'Nu.', round: 1, decimal: 2, delimiter: ',', short_format: 'Nu. {{amount}}', explicit_format: 'Nu. {{amount}} BTN', countries: ['BT'] },
    { code: 'BWP', numeric_code: '072', name: 'Botswana pula', symbol: 'P', round: 0.01, decimal: 2, delimiter: '.', short_format: 'P{{amount}}', explicit_format: 'P{{amount}} BWP', countries: ['BW'] },
    { code: 'BYN', numeric_code: '933', name: 'Belarusian ruble', symbol: 'Br', round: 0.01, decimal: 2, delimiter: ',', short_format: 'Br{{amount}}', explicit_format: 'Br{{amount}} BYN', countries: ['BY'] },
    { code: 'BZD', numeric_code: '084', name: 'Belize dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'BZ${{amount}}', countries: ['BZ'] },
    { code: 'CAD', numeric_code: '124', name: 'Canadian dollar', symbol: '$', round: 0.05, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'CA${{amount}}', countries: ['CA'] },
    { code: 'CDF', numeric_code: '976', name: 'Congolese franc', symbol: 'Fr', round: 1, decimal: 2, delimiter: '.', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} CDF', countries: ['CD'] },
    { code: 'CHF', numeric_code: '756', name: 'Swiss franc', symbol: 'Fr', round: 0.05, decimal: 2, delimiter: '.', short_format: 'Fr. {{amount}}', explicit_format: 'Fr. {{amount}} CHF', countries: ['CH', 'LI'] },
    { code: 'CLP', numeric_code: '152', name: 'Chilean peso', symbol: '$', round: 1, decimal: 0, delimiter: ',', short_format: '${{amount}}', explicit_format: 'CL${{amount}}', countries: ['CL'] },
    { code: 'CNY', numeric_code: '156', name: 'Chinese yuan', symbol: '¥', round: 0.01, decimal: 2, delimiter: '.', short_format: '¥{{amount}}', explicit_format: '¥{{amount}} CNY', countries: ['CN'] },
    { code: 'COP', numeric_code: '170', name: 'Colombian peso', symbol: '$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: 'CO${{amount}}', countries: ['CO'] },
    { code: 'CRC', numeric_code: '188', name: 'Costa Rican colón', symbol: '₡', round: 1, decimal: 2, delimiter: ',', short_format: '₡{{amount}}', explicit_format: '₡{{amount}} CRC', countries: ['CR'] },
    { code: 'CUP', numeric_code: '192', name: 'Cuban peso', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'CU${{amount}}', countries: ['CU'] },
    { code: 'CVE', numeric_code: '132', name: 'Cape Verdean escudo', symbol: '$', round: 1, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: '${{amount}} CVE', countries: ['CV'] },
    { code: 'CZK', numeric_code: '203', name: 'Czech koruna', symbol: 'Kč', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} Kč', explicit_format: '{{amount}} CZK', countries: ['CZ'] },
    { code: 'DJF', numeric_code: '262', name: 'Djiboutian franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} DJF', countries: ['DJ'] },
    { code: 'DKK', numeric_code: '208', name: 'Danish krone', symbol: 'kr', round: 0.25, decimal: 2, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} DKK', countries: ['DK', 'FO', 'GL'] },
    { code: 'DOP', numeric_code: '214', name: 'Dominican peso', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'RD${{amount}}', countries: ['DO'] },
    { code: 'DZD', numeric_code: '012', name: 'Algerian dinar', symbol: 'د.ج', round: 1, decimal: 2, delimiter: '.', short_format: '{{amount}} DA', explicit_format: '{{amount}} DZD', countries: ['DZ'] },
    { code: 'EGP', numeric_code: '818', name: 'Egyptian pound', symbol: 'ج.م', round: 0.05, decimal: 2, delimiter: '.', short_format: 'LE {{amount}}', explicit_format: 'LE {{amount}} EGP', countries: ['EG'] },
    { code: 'ERN', numeric_code: '232', name: 'Eritrean nakfa', symbol: 'Nfk', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Nfk {{amount}}', explicit_format: 'Nfk {{amount}} ERN', countries: ['ER'] },
    { code: 'ETB', numeric_code: '230', name: 'Ethiopian birr', symbol: 'Br', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Br{{amount}}', explicit_format: 'Br{{amount}} ETB', countries: ['ET'] },
    { code: 'EUR', numeric_code: '978', name: 'Euro', symbol: '€', round: 0.01, decimal: 2, delimiter: ',', short_format: '€{{amount}}', explicit_format: '€{{amount}} EUR', countries: ['AX', 'EU', 'AD', 'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'GF', 'TF', 'DE', 'GR', 'GP', 'IE', 'IT', 'XK', 'LV', 'LT', 'LU', 'MT', 'MQ', 'YT', 'MC', 'ME', 'NL', 'PT', 'RE', 'BL', 'MF', 'PM', 'SM', 'SK', 'SI', 'ES', 'VA'] },
    { code: 'FJD', numeric_code: '242', name: 'Fiji dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'FJ${{amount}}', countries: ['FJ'] },
    { code: 'FKP', numeric_code: '238', name: 'Falkland Islands pound', symbol: '£', round: 0.01, decimal: 2, delimiter: '.', short_format: '£{{amount}}', explicit_format: '£{{amount}} FKP', countries: ['FK'] },
    { code: 'GBP', numeric_code: '826', name: 'Pound sterling', symbol: '£', round: 0.01, decimal: 2, delimiter: '.', short_format: '£{{amount}}', explicit_format: '£{{amount}} GBP', countries: ['GB', 'IM', 'JE', 'GG'] },
    { code: 'GEL', numeric_code: '981', name: 'Georgian lari', symbol: '₾', round: 0.01, decimal: 2, delimiter: '.', short_format: '₾{{amount}}', explicit_format: '₾{{amount}} GEL', countries: ['GE'] },
    { code: 'GHS', numeric_code: '936', name: 'Ghanaian cedi', symbol: '₵', round: 0.01, decimal: 2, delimiter: '.', short_format: '₵{{amount}}', explicit_format: '₵{{amount}} GHS', countries: ['GH'] },
    { code: 'GIP', numeric_code: '292', name: 'Gibraltar pound', symbol: '£', round: 0.01, decimal: 2, delimiter: '.', short_format: '£{{amount}}', explicit_format: '£{{amount}} GIP', countries: ['GI'] },
    { code: 'GMD', numeric_code: '270', name: 'Gambian dalasi', symbol: 'D', round: 0.01, decimal: 2, delimiter: '.', short_format: 'D{{amount}}', explicit_format: 'D{{amount}} GMD', countries: ['GM'] },
    { code: 'GNF', numeric_code: '324', name: 'Guinean franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} GNF', countries: ['GN'] },
    { code: 'GTQ', numeric_code: '320', name: 'Guatemalan quetzal', symbol: 'Q', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Q{{amount}}', explicit_format: 'Q{{amount}} GTQ', countries: ['GT'] },
    { code: 'GYD', numeric_code: '328', name: 'Guyanese dollar', symbol: '$', round: 1, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'GY${{amount}}', countries: ['GY'] },
    { code: 'HKD', numeric_code: '344', name: 'Hong Kong dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'HK${{amount}}', countries: ['HK'] },
    { code: 'HNL', numeric_code: '340', name: 'Honduran lempira', symbol: 'L', round: 0.01, decimal: 2, delimiter: '.', short_format: 'L{{amount}}', explicit_format: 'L{{amount}} HNL', countries: ['HN'] },
    { code: 'HRK', numeric_code: '191', name: 'Croatian kuna', symbol: 'kn', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} kn', explicit_format: '{{amount}} HRK', countries: ['HR'] },
    { code: 'HTG', numeric_code: '332', name: 'Haitian gourde', symbol: 'G', round: 0.01, decimal: 2, delimiter: '.', short_format: 'G{{amount}}', explicit_format: 'G{{amount}} HTG', countries: ['HT'] },
    { code: 'HUF', numeric_code: '348', name: 'Hungarian forint', symbol: 'Ft', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} Ft', explicit_format: '{{amount}} HUF', countries: ['HU'] },
    { code: 'IDR', numeric_code: '360', name: 'Indonesian rupiah', symbol: 'Rp', round: 1, decimal: 2, delimiter: ',', short_format: 'Rp{{amount}}', explicit_format: 'Rp{{amount}} IDR', countries: ['ID'] },
    { code: 'ILS', numeric_code: '376', name: 'Israeli new shekel', symbol: '₪', round: 0.01, decimal: 2, delimiter: '.', short_format: '₪{{amount}}', explicit_format: '₪{{amount}} ILS', countries: ['IL', 'PS'] },
    { code: 'INR', numeric_code: '356', name: 'Indian rupee', symbol: '₹', round: 0.05, decimal: 2, delimiter: ',', short_format: '₹{{amount}}', explicit_format: '₹{{amount}} INR', countries: ['IN', 'BT'] },
    { code: 'IQD', numeric_code: '368', name: 'Iraqi dinar', symbol: 'ع.د', round: 1, decimal: 3, delimiter: '.', short_format: '{{amount}} ID', explicit_format: '{{amount}} IQD', countries: ['IQ'] },
    { code: 'IRR', numeric_code: '364', name: 'Iranian rial', symbol: '﷼', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} ﷼', explicit_format: '{{amount}} IRR', countries: ['IR'] },
    { code: 'ISK', numeric_code: '352', name: 'Icelandic króna', symbol: 'kr', round: 1, decimal: 0, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} ISK', countries: ['IS'] },
    { code: 'JMD', numeric_code: '388', name: 'Jamaican dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'J${{amount}}', countries: ['JM'] },
    { code: 'JOD', numeric_code: '400', name: 'Jordanian dinar', symbol: 'د.أ', round: 0.001, decimal: 3, delimiter: '.', short_format: '{{amount}} JD', explicit_format: '{{amount}} JOD', countries: ['JO'] },
    { code: 'JPY', numeric_code: '392', name: 'Japanese yen', symbol: '¥', round: 1, decimal: 0, delimiter: ',', short_format: '¥{{amount}}', explicit_format: '¥{{amount}} JPY', countries: ['JP'] },
    { code: 'KES', numeric_code: '404', name: 'Kenyan shilling', symbol: 'Ksh', round: 0.05, decimal: 2, delimiter: '.', short_format: 'KSh{{amount}}', explicit_format: 'KSh{{amount}} KES', countries: ['KE'] },
    { code: 'KGS', numeric_code: '417', name: 'Kyrgyzstani som', symbol: 'с', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} с', explicit_format: '{{amount}} KGS', countries: ['KG'] },
    { code: 'KHR', numeric_code: '116', name: 'Cambodian riel', symbol: '៛', round: 1, decimal: 2, delimiter: '.', short_format: '{{amount}}៛', explicit_format: '{{amount}}៛ KHR', countries: ['KH'] },
    { code: 'KMF', numeric_code: '174', name: 'Comoro franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} KMF', countries: ['KM'] },
    { code: 'KPW', numeric_code: '408', name: 'North Korean won', symbol: '₩', round: 1, decimal: 2, delimiter: '.', short_format: '₩{{amount}}', explicit_format: '₩{{amount}} KPW', countries: ['KP'] },
    { code: 'KRW', numeric_code: '410', name: 'South Korean won', symbol: '₩', round: 1, decimal: 0, delimiter: ',', short_format: '₩{{amount}}', explicit_format: '₩{{amount}} KRW', countries: ['KR'] },
    { code: 'KWD', numeric_code: '414', name: 'Kuwaiti dinar', symbol: 'د.ك', round: 0.001, decimal: 3, delimiter: '.', short_format: '{{amount}} KD', explicit_format: '{{amount}} KWD', countries: ['KW'] },
    { code: 'KYD', numeric_code: '136', name: 'Cayman Islands dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'CI${{amount}}', countries: ['KY'] },
    { code: 'KZT', numeric_code: '398', name: 'Kazakhstani tenge', symbol: '₸', round: 0.01, decimal: 2, delimiter: '.', short_format: '₸{{amount}}', explicit_format: '₸{{amount}} KZT', countries: ['KZ'] },
    { code: 'LAK', numeric_code: '418', name: 'Lao kip', symbol: '₭', round: 1, decimal: 2, delimiter: ',', short_format: '₭{{amount}}', explicit_format: '₭{{amount}} LAK', countries: ['LA'] },
    { code: 'LBP', numeric_code: '422', name: 'Lebanese pound', symbol: 'ل.ل', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} LL', explicit_format: '{{amount}} LBP', countries: ['LB'] },
    { code: 'LKR', numeric_code: '144', name: 'Sri Lankan rupee', symbol: 'Rs', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Rs{{amount}}', explicit_format: 'Rs{{amount}} LKR', countries: ['LK'] },
    { code: 'LRD', numeric_code: '430', name: 'Liberian dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'L${{amount}}', countries: ['LR'] },
    { code: 'LSL', numeric_code: '426', name: 'Lesotho loti', symbol: 'L', round: 0.01, decimal: 2, delimiter: '.', short_format: 'L{{amount}}', explicit_format: 'L{{amount}} LSL', countries: ['LS'] },
    { code: 'LYD', numeric_code: '434', name: 'Libyan dinar', symbol: 'ل.د', round: 0.001, decimal: 3, delimiter: '.', short_format: '{{amount}} LD', explicit_format: '{{amount}} LYD', countries: ['LY'] },
    { code: 'MAD', numeric_code: '504', name: 'Moroccan dirham', symbol: 'د.م.', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} DH', explicit_format: '{{amount}} MAD', countries: ['MA', 'EH'] },
    { code: 'MDL', numeric_code: '498', name: 'Moldovan leu', symbol: 'L', round: 0.01, decimal: 2, delimiter: '.', short_format: 'L{{amount}}', explicit_format: 'L{{amount}} MDL', countries: ['MD'] },
    { code: 'MGA', numeric_code: '969', name: 'Malagasy ariary', symbol: 'Ar', round: 1, decimal: 2, delimiter: ',', short_format: 'Ar{{amount}}', explicit_format: 'Ar{{amount}} MGA', countries: ['MG'] },
    { code: 'MKD', numeric_code: '807', name: 'Macedonian denar', symbol: 'ден', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} ден', explicit_format: '{{amount}} MKD', countries: ['MK'] },
    { code: 'MMK', numeric_code: '104', name: 'Myanmar kyat', symbol: 'Ks', round: 1, decimal: 2, delimiter: '.', short_format: 'Ks{{amount}}', explicit_format: 'Ks{{amount}} MMK', countries: ['MM'] },
    { code: 'MNT', numeric_code: '496', name: 'Mongolian tögrög', symbol: '₮', round: 1, decimal: 2, delimiter: '.', short_format: '₮{{amount}}', explicit_format: '₮{{amount}} MNT', countries: ['MN'] },
    { code: 'MOP', numeric_code: '446', name: 'Macanese pataca', symbol: 'P', round: 0.01, decimal: 2, delimiter: '.', short_format: 'P{{amount}}', explicit_format: 'P{{amount}} MOP', countries: ['MO'] },
    { code: 'MRU', numeric_code: '929', name: 'Mauritanian ouguiya', symbol: 'UM', round: 1, decimal: 2, delimiter: ',', short_format: 'UM{{amount}}', explicit_format: 'UM{{amount}} MRU', countries: ['MR'] },
    { code: 'MUR', numeric_code: '480', name: 'Mauritian rupee', symbol: '₨', round: 0.01, decimal: 2, delimiter: '.', short_format: '₨{{amount}}', explicit_format: '₨{{amount}} MUR', countries: ['MU'] },
    { code: 'MVR', numeric_code: '462', name: 'Maldivian rufiyaa', symbol: '.ރ', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} Rf', explicit_format: '{{amount}} MVR', countries: ['MV'] },
    { code: 'MWK', numeric_code: '454', name: 'Malawian kwacha', symbol: 'MK', round: 1, decimal: 2, delimiter: '.', short_format: 'MK{{amount}}', explicit_format: 'MK{{amount}} MWK', countries: ['MW'] },
    { code: 'MXN', numeric_code: '484', name: 'Mexican peso', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'MX${{amount}}', countries: ['MX'] },
    { code: 'MYR', numeric_code: '458', name: 'Malaysian ringgit', symbol: 'RM', round: 0.01, decimal: 2, delimiter: '.', short_format: 'RM{{amount}}', explicit_format: 'RM{{amount}} MYR', countries: ['MY'] },
    { code: 'MZN', numeric_code: '943', name: 'Mozambican metical', symbol: 'MT', round: 0.01, decimal: 2, delimiter: ',', short_format: 'MT{{amount}}', explicit_format: 'MT{{amount}} MZN', countries: ['MZ'] },
    { code: 'NAD', numeric_code: '516', name: 'Namibian dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'N${{amount}}', countries: ['NA'] },
    { code: 'NGN', numeric_code: '566', name: 'Nigerian naira', symbol: '₦', round: 0.01, decimal: 2, delimiter: '.', short_format: '₦{{amount}}', explicit_format: '₦{{amount}} NGN', countries: ['NG'] },
    { code: 'NIO', numeric_code: '558', name: 'Nicaraguan córdoba', symbol: 'C$', round: 0.01, decimal: 2, delimiter: '.', short_format: 'C${{amount}}', explicit_format: 'C${{amount}} NIO', countries: ['NI'] },
    { code: 'NOK', numeric_code: '578', name: 'Norwegian krone', symbol: 'kr', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} NOK', countries: ['NO', 'SJ', 'BV'] },
    { code: 'NPR', numeric_code: '524', name: 'Nepalese rupee', symbol: '₨', round: 0.01, decimal: 2, delimiter: '.', short_format: '₨{{amount}}', explicit_format: '₨{{amount}} NPR', countries: ['NP'] },
    { code: 'NZD', numeric_code: '554', name: 'New Zealand dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'NZ${{amount}}', countries: ['NZ', 'CK', 'NU', 'PN', 'TK'] },
    { code: 'OMR', numeric_code: '512', name: 'Omani rial', symbol: 'ر.ع.', round: 0.001, decimal: 3, delimiter: '.', short_format: '{{amount}} OR', explicit_format: '{{amount}} OMR', countries: ['OM'] },
    { code: 'PAB', numeric_code: '590', name: 'Panamanian balboa', symbol: 'B/.', round: 0.01, decimal: 2, delimiter: '.', short_format: 'B/. {{amount}}', explicit_format: 'B/. {{amount}} PAB', countries: ['PA'] },
    { code: 'PEN', numeric_code: '604', name: 'Peruvian sol', symbol: 'S/', round: 0.01, decimal: 2, delimiter: '.', short_format: 'S/{{amount}}', explicit_format: 'S/{{amount}} PEN', countries: ['PE'] },
    { code: 'PGK', numeric_code: '598', name: 'Papua New Guinean kina', symbol: 'K', round: 0.01, decimal: 2, delimiter: '.', short_format: 'K{{amount}}', explicit_format: 'K{{amount}} PGK', countries: ['PG'] },
    { code: 'PHP', numeric_code: '608', name: 'Philippine peso', symbol: '₱', round: 0.01, decimal: 2, delimiter: '.', short_format: '₱{{amount}}', explicit_format: '₱{{amount}} PHP', countries: ['PH'] },
    { code: 'PKR', numeric_code: '586', name: 'Pakistani rupee', symbol: '₨', round: 1, decimal: 2, delimiter: ',', short_format: '₨{{amount}}', explicit_format: '₨{{amount}} PKR', countries: ['PK'] },
    { code: 'PLN', numeric_code: '985', name: 'Polish złoty', symbol: 'zł', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} zł', explicit_format: '{{amount}} PLN', countries: ['PL'] },
    { code: 'PYG', numeric_code: '600', name: 'Paraguayan guaraní', symbol: '₲', round: 1, decimal: 0, delimiter: ',', short_format: '₲{{amount}}', explicit_format: '₲{{amount}} PYG', countries: ['PY'] },
    { code: 'QAR', numeric_code: '634', name: 'Qatari riyal', symbol: 'ر.ق', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} QR', explicit_format: '{{amount}} QAR', countries: ['QA'] },
    { code: 'RON', numeric_code: '946', name: 'Romanian leu', symbol: 'lei', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} lei', explicit_format: '{{amount}} RON', countries: ['RO'] },
    { code: 'RSD', numeric_code: '941', name: 'Serbian dinar', symbol: 'дин', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} дин', explicit_format: '{{amount}} RSD', countries: ['RS'] },
    { code: 'RUB', numeric_code: '643', name: 'Russian ruble', symbol: '₽', round: 0.01, decimal: 2, delimiter: ',', short_format: '₽{{amount}}', explicit_format: '₽{{amount}} RUB', countries: ['RU'] },
    { code: 'RWF', numeric_code: '646', name: 'Rwandan franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} RWF', countries: ['RW'] },
    { code: 'SAR', numeric_code: '682', name: 'Saudi riyal', symbol: 'ر.س', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} SR', explicit_format: '{{amount}} SAR', countries: ['SA'] },
    { code: 'SBD', numeric_code: '090', name: 'Solomon Islands dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'SI${{amount}}', countries: ['SB'] },
    { code: 'SCR', numeric_code: '690', name: 'Seychelles rupee', symbol: '₨', round: 0.01, decimal: 2, delimiter: '.', short_format: '₨{{amount}}', explicit_format: '₨{{amount}} SCR', countries: ['SC'] },
    { code: 'SDG', numeric_code: '938', name: 'Sudanese pound', symbol: 'ج.س.', round: 0.01, decimal: 2, delimiter: '.', short_format: '{{amount}} SD', explicit_format: '{{amount}} SDG', countries: ['SD'] },
    { code: 'SEK', numeric_code: '752', name: 'Swedish krona', symbol: 'kr', round: 0.01, decimal: 2, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} SEK', countries: ['SE'] },
    { code: 'SGD', numeric_code: '702', name: 'Singapore dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'S${{amount}}', countries: ['SG'] },
    { code: 'SHP', numeric_code: '654', name: 'Saint Helena pound', symbol: '£', round: 0.01, decimal: 2, delimiter: '.', short_format: '£{{amount}}', explicit_format: '£{{amount}} SHP', countries: ['SH'] },
    { code: 'SLE', numeric_code: '925', name: 'Sierra Leonean leone', symbol: 'Le', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Le{{amount}}', explicit_format: 'Le{{amount}} SLE', countries: ['SL'] },
    { code: 'SOS', numeric_code: '706', name: 'Somali shilling', symbol: 'Sh', round: 1, decimal: 2, delimiter: '.', short_format: 'Sh{{amount}}', explicit_format: 'Sh{{amount}} SOS', countries: ['SO'] },
    { code: 'SRD', numeric_code: '968', name: 'Surinamese dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'SR${{amount}}', countries: ['SR'] },
    { code: 'SSP', numeric_code: '728', name: 'South Sudanese pound', symbol: '£', round: 0.01, decimal: 2, delimiter: '.', short_format: '£{{amount}}', explicit_format: '£{{amount}} SSP', countries: ['SS'] },
    { code: 'STN', numeric_code: '930', name: 'São Tomé and Príncipe dobra', symbol: 'Db', round: 0.01, decimal: 2, delimiter: '.', short_format: 'Db{{amount}}', explicit_format: 'Db{{amount}} STN', countries: ['ST'] },
    { code: 'SYP', numeric_code: '760', name: 'Syrian pound', symbol: 'ل.س', round: 1, decimal: 2, delimiter: '.', short_format: '{{amount}} SP', explicit_format: '{{amount}} SYP', countries: ['SY'] },
    { code: 'SZL', numeric_code: '748', name: 'Swazi lilangeni', symbol: 'L', round: 0.01, decimal: 2, delimiter: '.', short_format: 'L{{amount}}', explicit_format: 'L{{amount}} SZL', countries: ['SZ'] },
    { code: 'THB', numeric_code: '764', name: 'Thai baht', symbol: '฿', round: 0.25, decimal: 2, delimiter: '.', short_format: '฿{{amount}}', explicit_format: '฿{{amount}} THB', countries: ['TH'] },
    { code: 'TJS', numeric_code: '972', name: 'Tajikistani somoni', symbol: 'ЅМ', round: 0.01, decimal: 2, delimiter: '.', short_format: 'ЅМ{{amount}}', explicit_format: 'ЅМ{{amount}} TJS', countries: ['TJ'] },
    { code: 'TMT', numeric_code: '934', name: 'Turkmenistan manat', symbol: 'm', round: 0.01, decimal: 2, delimiter: '.', short_format: 'm{{amount}}', explicit_format: 'm{{amount}} TMT', countries: ['TM'] },
    { code: 'TND', numeric_code: '788', name: 'Tunisian dinar', symbol: 'د.ت', round: 0.001, decimal: 3, delimiter: '.', short_format: '{{amount}} TD', explicit_format: '{{amount}} TND', countries: ['TN'] },
    { code: 'TOP', numeric_code: '776', name: 'Tongan paʻanga', symbol: 'T$', round: 0.01, decimal: 2, delimiter: '.', short_format: 'T${{amount}}', explicit_format: 'T${{amount}} TOP', countries: ['TO'] },
    { code: 'TRY', numeric_code: '949', name: 'Turkish lira', symbol: '₺', round: 0.01, decimal: 2, delimiter: ',', short_format: '₺{{amount}}', explicit_format: '₺{{amount}} TRY', countries: ['TR'] },
    { code: 'TTD', numeric_code: '780', name: 'Trinidad and Tobago dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'TT${{amount}}', countries: ['TT'] },
    { code: 'TVD', numeric_code: '798', name: 'Tuvaluan dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'TV${{amount}}', countries: ['TV'] },
    { code: 'TWD', numeric_code: '901', name: 'New Taiwan dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'NT${{amount}}', countries: ['TW'] },
    { code: 'TZS', numeric_code: '834', name: 'Tanzanian shilling', symbol: 'Sh', round: 1, decimal: 2, delimiter: '.', short_format: 'Sh{{amount}}', explicit_format: 'Sh{{amount}} TZS', countries: ['TZ'] },
    { code: 'UAH', numeric_code: '980', name: 'Ukrainian hryvnia', symbol: '₴', round: 0.01, decimal: 2, delimiter: ',', short_format: '₴{{amount}}', explicit_format: '₴{{amount}} UAH', countries: ['UA'] },
    { code: 'UGX', numeric_code: '800', name: 'Ugandan shilling', symbol: 'Sh', round: 1, decimal: 0, delimiter: ',', short_format: 'Sh{{amount}}', explicit_format: 'Sh{{amount}} UGX', countries: ['UG'] },
    { code: 'USD', numeric_code: '840', name: 'United States dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'US${{amount}}', countries: ['US', 'AS', 'BQ', 'IO', 'EC', 'SV', 'GU', 'HT', 'MH', 'FM', 'MP', 'PW', 'PA', 'PR', 'TL', 'TC', 'VI', 'VG', 'ZW'] },
    { code: 'UYU', numeric_code: '858', name: 'Uruguayan peso', symbol: '$', round: 0.01, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: 'UY${{amount}}', countries: ['UY'] },
    { code: 'UZS', numeric_code: '860', name: 'Uzbekistan som', symbol: 'сўм', round: 1, decimal: 2, delimiter: '.', short_format: '{{amount}} сўм', explicit_format: '{{amount}} UZS', countries: ['UZ'] },
    { code: 'VED', numeric_code: '926', name: 'Venezuelan bolívar digital', symbol: 'Bs.D', round: 0.01, decimal: 2, delimiter: ',', short_format: 'Bs.D {{amount}}', explicit_format: 'Bs.D {{amount}} VED', countries: ['VE'] },
    { code: 'VES', numeric_code: '928', name: 'Venezuelan bolívar soberano', symbol: 'Bs.S', round: 0.01, decimal: 2, delimiter: ',', short_format: 'Bs.S {{amount}}', explicit_format: 'Bs.S {{amount}} VES', countries: ['VE'] },
    { code: 'VND', numeric_code: '704', name: 'Vietnamese đồng', symbol: '₫', round: 1, decimal: 0, delimiter: ',', short_format: '{{amount}}₫', explicit_format: '{{amount}}₫ VND', countries: ['VN'] },
    { code: 'VUV', numeric_code: '548', name: 'Vanuatu vatu', symbol: 'Vt', round: 1, decimal: 0, delimiter: ',', short_format: 'Vt{{amount}}', explicit_format: 'Vt{{amount}} VUV', countries: ['VU'] },
    { code: 'WST', numeric_code: '882', name: 'Samoan tālā', symbol: 'T', round: 0.01, decimal: 2, delimiter: '.', short_format: 'T{{amount}}', explicit_format: 'T{{amount}} WST', countries: ['WS'] },
    { code: 'XAF', numeric_code: '950', name: 'CFA franc BEAC', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} XAF', countries: ['CM', 'CF', 'TD', 'CG', 'GQ', 'GA'] },
    { code: 'XCD', numeric_code: '951', name: 'East Caribbean dollar', symbol: '$', round: 0.01, decimal: 2, delimiter: '.', short_format: '${{amount}}', explicit_format: 'EC${{amount}}', countries: ['AI', 'AG', 'DM', 'GD', 'MS', 'KN', 'LC', 'VC'] },
    { code: 'XDR', numeric_code: '960', name: 'Special drawing rights', symbol: 'SDR', round: 0.01, decimal: 2, delimiter: '.', short_format: 'SDR{{amount}}', explicit_format: 'SDR{{amount}} XDR', countries: [] },
    { code: 'XOF', numeric_code: '952', name: 'CFA franc BCEAO', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} XOF', countries: ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'] },
    { code: 'XPF', numeric_code: '953', name: 'CFP franc', symbol: 'Fr', round: 1, decimal: 0, delimiter: ',', short_format: 'Fr{{amount}}', explicit_format: 'Fr{{amount}} XPF', countries: ['PF', 'NC', 'WF'] },
    { code: 'YER', numeric_code: '886', name: 'Yemeni rial', symbol: '﷼', round: 1, decimal: 2, delimiter: '.', short_format: '{{amount}} YR', explicit_format: '{{amount}} YER', countries: ['YE'] },
    { code: 'ZAR', numeric_code: '710', name: 'South African rand', symbol: 'R', round: 0.01, decimal: 2, delimiter: '.', short_format: 'R{{amount}}', explicit_format: 'R{{amount}} ZAR', countries: ['ZA', 'LS', 'NA'] },
    { code: 'ZMW', numeric_code: '967', name: 'Zambian kwacha', symbol: 'ZK', round: 0.01, decimal: 2, delimiter: '.', short_format: 'ZK{{amount}}', explicit_format: 'ZK{{amount}} ZMW', countries: ['ZM'] },
    { code: 'ZWL', numeric_code: '932', name: 'Zimbabwean dollar (fifth)', symbol: 'ZWL', round: 0.01, decimal: 2, delimiter: '.', short_format: 'ZWL{{amount}}', explicit_format: 'ZWL{{amount}} ZWL', countries: ['ZW'] }
  ]

  /**
   * Get all supported currencies
   */
  public get currencies(): CurrencyCode[] {
    return this.currencyList.map(c => c.code)
  }

  /**
   * Abstract methods that must be implemented by subclasses
   */
  abstract latestRates(params?: ExchangeRatesParams): Promise<ExchangeRatesResult>
  abstract convert(params: ConvertParams): Promise<ConversionResult>
  abstract getConvertRate(from: CurrencyCode, to: CurrencyCode, currencyList?: Record<string, any>[]): Promise<number | undefined>

  /**
   * Set base currency
   */
  setBase(currency: CurrencyCode): this {
    this.base = currency
    return this
  }

  /**
   * Set API key (default implementation - can be overridden)
   */
  setKey(_key: string): this {
    // Default implementation does nothing
    // Providers that need API keys should override this
    return this
  }

  /**
   * Health check - test with simple conversion
   */
  async isHealthy(): Promise<boolean> {
    try {
      const result = await this.convert({ amount: 1, from: 'USD', to: 'EUR' })
      return result.success && !!result.result
    } catch {
      return false
    }
  }

  /**
   * Get detailed health information
   */
  async getHealthInfo(): Promise<HealthCheckResult> {
    const startTime = Date.now()
    try {
      const result = await this.convert({ amount: 1, from: 'USD', to: 'EUR' })
      const latency = Math.max(Date.now() - startTime, 1) // Ensure minimum 1ms latency

      return {
        healthy: result.success && !!result.result,
        latency,
        error: result.error?.info
      }
    } catch (error) {
      return {
        healthy: false,
        latency: Math.max(Date.now() - startTime, 1), // Ensure minimum 1ms latency
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }

  /**
   * Get supported currencies
   */
  async getSupportedCurrencies(): Promise<CurrencyCode[]> {
    return this.currencies
  }

  /**
   * Validate if currency is supported
   */
  async isCurrencySupported(currency: CurrencyCode): Promise<boolean> {
    return this.currencies.includes(currency)
  }

  /**
   * Create standardized conversion result
   */
  protected createConversionResult(
    amount: number,
    from: CurrencyCode,
    to: CurrencyCode,
    result?: number,
    rate?: number,
    error?: { code?: number; info: string; type?: string }
  ): ConversionResult {
    return {
      success: !error && result !== undefined,
      query: { from, to, amount },
      info: { timestamp: Date.now(), rate },
      date: new Date().toISOString(),
      result,
      error
    }
  }

  /**
   * Create standardized exchange rates result
   */
  protected createExchangeRatesResult(
    base: CurrencyCode,
    rates: Record<string, number>,
    error?: { code?: number; info: string; type?: string }
  ): ExchangeRatesResult {
    return {
      success: !error && Object.keys(rates).length > 0,
      timestamp: Date.now(),
      date: new Date().toISOString(),
      base,
      rates,
      error
    }
  }

  /**
   * Utility methods for currency information
   */
  getList(): CurrencyInfo[] {
    return this.currencyList
  }

  filterByName(name: string): CurrencyInfo[] {
    return this.currencyList.filter(c => c.name.toLowerCase().includes(name.toLowerCase()))
  }

  filterByCountry(iso2: string): CurrencyInfo[] {
    return this.currencyList.filter(c => c.countries.includes(iso2.toUpperCase()))
  }

  getByCountry(iso2: string): CurrencyInfo | undefined {
    return this.currencyList.find(c => c.countries.includes(iso2.toUpperCase()))
  }

  getByCode(code: CurrencyCode): CurrencyInfo | undefined {
    return this.currencyList.find(c => c.code === code)
  }

  getBySymbol(symbol: string): CurrencyInfo | undefined {
    return this.currencyList.find(c => c.symbol === symbol)
  }

  getByNumericCode(numCode: string): CurrencyInfo | undefined {
    return this.currencyList.find(c => c.numeric_code === numCode)
  }

  /**
   * Round currency value according to currency rules
   */
  round(value: number, precision?: number): number {
    if (precision !== undefined) {
      return Math.round(value * Math.pow(10, precision)) / Math.pow(10, precision)
    }

    // Use default precision of 2 decimal places
    return Math.round(value * 100) / 100
  }
}
