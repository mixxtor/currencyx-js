/**
 * Currency Data
 * 
 * Contains basic currency information for common currencies
 */

export type CurrencyInfo = typeof CURRENCIES[number]
export type CurrencyCode = CurrencyInfo['code'] | (string & {})
type CurrencySymbol = CurrencyInfo['symbol']
export type CountryCode = CurrencyInfo['countries'][number] | (string & {})
type CountryName = CurrencyInfo['name']
type CountryNumericCode = CurrencyInfo['numeric_code']

/**
 * List of currencies
 * @link https://en.wikipedia.org/wiki/ISO_4217
 */
// prettier-ignore
export const CURRENCIES = [
  { code: 'AED', numeric_code: '784', name: 'United Arab Emirates dirham', symbol: 'د.إ', round: 1, decimal: 2, delimiter: '.', short_format: 'Dhs. {{amount}}', explicit_format: 'Dhs. {{amount}} AED', countries: ['AE'] },
  { code: 'AFN', numeric_code: '971', name: 'Afghan afghani', symbol: '؋', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}}؋', explicit_format: '{{amount}}؋ AFN', countries: ['AF'] },
  { code: 'ALL', numeric_code: '008', name: 'Albanian lek', symbol: 'Lek', round: 100, decimal: 2, delimiter: ',', short_format: 'Lek {{amount}}', explicit_format: 'Lek {{amount}} ALL', countries: ['AL'] },
  { code: 'AMD', numeric_code: '051', name: 'Armenian dram', symbol: '֏', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}} AMD', explicit_format: '{{amount}} AMD', countries: ['AM'] },
  { code: 'ANG', numeric_code: '532', name: 'Netherlands Antillean guilder', symbol: 'ƒ', round: 1, decimal: 2, delimiter: ',', short_format: 'ƒ;{{amount}}', explicit_format: '{{amount}} NAƒ;', countries: ['CW', 'SX'] },
  { code: 'AOA', numeric_code: '973', name: 'Angolan kwanza', symbol: 'Kz', round: 100, decimal: 2, delimiter: ',', short_format: 'Kz{{amount}}', explicit_format: 'Kz{{amount}} AOA', countries: ['AO'] },
  { code: 'ARS', numeric_code: '032', name: 'Argentine peso', symbol: 'AR$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} ARS', countries: ['AR'] },
  { code: 'AUD', numeric_code: '036', name: 'Australian dollar', symbol: 'AU$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} AUD', countries: ['AU', 'CX', 'CC', 'HM', 'KI', 'NR', 'NF', 'TV'] },
  { code: 'AWG', numeric_code: '533', name: 'Aruban florin', symbol: 'Afl.', round: 1, decimal: 2, delimiter: ',', short_format: 'Afl{{amount}}', explicit_format: 'Afl{{amount}} AWG', countries: ['AW'] },
  { code: 'AZN', numeric_code: '944', name: 'Azerbaijani manat', symbol: '₼', round: 1, decimal: 2, delimiter: ',', short_format: 'm.{{amount}}', explicit_format: 'm.{{amount}} AZN', countries: ['AZ'] },
  { code: 'BAM', numeric_code: '977', name: 'Bosnia and Herzegovina convertible mark', symbol: 'KM', round: 1, decimal: 2, delimiter: ',', short_format: 'KM {{amount}}', explicit_format: 'KM {{amount}} BAM', countries: ['BA'] },
  { code: 'BBD', numeric_code: '052', name: 'Barbados dollar', symbol: '$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} Bds', countries: ['BB'] },
  { code: 'BDT', numeric_code: '050', name: 'Bangladeshi taka', symbol: '৳', round: 100, decimal: 2, delimiter: ',', short_format: 'Tk {{amount}}', explicit_format: 'Tk {{amount}} BDT', countries: ['BD'] },
  { code: 'BGN', numeric_code: '975', name: 'Bulgarian lev', symbol: 'лв', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} лв', explicit_format: '{{amount}} лв BGN', countries: ['BG'] },
  { code: 'BHD', numeric_code: '048', name: 'Bahraini dinar', symbol: '.د.ب', round: 0, decimal: 0, delimiter: ',', short_format: '{{amount}} BD', explicit_format: '{{amount}} BHD', countries: ['BH'] },
  { code: 'BIF', numeric_code: '108', name: 'Burundian franc', symbol: 'FBu', round: 1000, decimal: 0, delimiter: ',', short_format: 'FBu. {{amount}}', explicit_format: 'FBu. {{amount}} BIF', countries: ['BI'] },
  { code: 'BMD', numeric_code: '060', name: 'Bermudian dollar', symbol: '$', round: 1, decimal: 2, delimiter: ',', short_format: 'BD${{amount}}', explicit_format: 'BD${{amount}} BMD', countries: ['BM'] },
  { code: 'BND', numeric_code: '096', name: 'Brunei dollar', symbol: 'BN$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} BND', countries: ['BN'] },
  { code: 'BOB', numeric_code: '068', name: 'Boliviano', symbol: 'Bs', round: 1, decimal: 2, delimiter: ',', short_format: 'Bs{{amount}}', explicit_format: 'Bs{{amount}} BOB', countries: ['BO'] },
  // { code: "BOV", numeric_code: "984", name: "Bolivian Mvdol (funds code)", symbol: "", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["BO"] },
  { code: 'BRL', numeric_code: '986', name: 'Brazilian real', symbol: 'R$', round: 1, decimal: 2, delimiter: ',', short_format: 'R$ {{amount}}', explicit_format: 'R$ {{amount}} BRL', countries: ['BR'] },
  { code: 'BSD', numeric_code: '044', name: 'Bahamian dollar', symbol: '$', round: 1, decimal: 2, delimiter: ',', short_format: 'BS${{amount}}', explicit_format: 'BS${{amount}} BSD', countries: ['BS'] },
  { code: 'BTC', numeric_code: 'BTC', name: 'Bitcoin', symbol: '₿', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: [] },
  { code: 'BTN', numeric_code: '064', name: 'Bhutanese ngultrum', symbol: 'Nu.', round: 0, decimal: 0, delimiter: ',', short_format: 'Nu {{amount}}', explicit_format: 'Nu {{amount}} BTN', countries: ['BT'] },
  { code: 'BWP', numeric_code: '072', name: 'Botswana pula', symbol: 'P', round: 1, decimal: 2, delimiter: ',', short_format: 'P{{amount}}', explicit_format: 'P{{amount}} BWP', countries: ['BW'] },
  { code: 'BYR', numeric_code: '974', name: 'Belarusian ruble (pre-2016)', symbol: 'Rbl', round: 0, decimal: 0, delimiter: ',', short_format: 'Br {{amount}}', explicit_format: 'Br {{amount}} BYR', countries: ['BY'] },
  { code: 'BYN', numeric_code: '933', name: 'Belarusian ruble', symbol: 'Rbl', round: 0, decimal: 0, delimiter: ',', short_format: 'Br {{amount}}', explicit_format: 'Br {{amount}} BYN', countries: ['BY'] },
  { code: 'BZD', numeric_code: '084', name: 'Belize dollar', symbol: 'BZ$', round: 1, decimal: 2, delimiter: ',', short_format: 'BZ${{amount}}', explicit_format: 'BZ${{amount}} BZD', countries: ['BZ'] },
  { code: 'CAD', numeric_code: '124', name: 'Canadian dollar', symbol: 'CA$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} CAD', countries: ['CA'] },
  { code: 'CDF', numeric_code: '976', name: 'Congolese franc', symbol: 'FC', round: 1000, decimal: 2, delimiter: ',', short_format: 'FC{{amount}}', explicit_format: 'FC{{amount}} CDF', countries: ['CD'] },
  // { code: "CHE", numeric_code: "947", name: "WIR euro (complementary currency)", symbol: "CHE", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["CH"] },
  { code: 'CHF', numeric_code: '756', name: 'Swiss franc', symbol: 'S₣', round: 1, decimal: 2, delimiter: ',', short_format: 'S₣{{amount}}', explicit_format: 'S₣{{amount}} CHF', countries: ['CH', 'LI'] },
  // { code: "CHW", numeric_code: "948", name: "WIR franc (complementary currency)", symbol: "CHW", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["CH"] },
  { code: 'CLF', numeric_code: '990', name: 'Chilean Unit of Account (UF)', symbol: 'UF', round: 0, decimal: 0, delimiter: ',', short_format: 'UF {{amount}}', explicit_format: 'UF{{amount}} CLF', countries: ['CL'] },
  { code: 'CLP', numeric_code: '152', name: 'Chilean peso', symbol: 'CL$', round: 100, decimal: 0, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} CLP', countries: ['CL'] },
  { code: 'CNY', numeric_code: '156', name: 'Renminbi', symbol: 'CN¥', round: 1.0, decimal: 2, delimiter: ',', short_format: '¥{{amount}}', explicit_format: '¥{{amount}} CNY', countries: ['CN'] },
  { code: 'COP', numeric_code: '170', name: 'Colombian peso', symbol: 'CO$', round: 1000, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} COP', countries: ['CO'] },
  // { code: "COU", numeric_code: "970", name: "Unidad de Valor Real (UVR) (funds code)", symbol: "COU", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["CO"] },
  { code: 'CRC', numeric_code: '188', name: 'Costa Rican colon', symbol: '₡', round: 100, decimal: 2, delimiter: ',', short_format: '₡{{amount}}', explicit_format: '₡ {{amount}} CRC', countries: ['CR'] },
  { code: 'CUC', numeric_code: '931', name: 'Cuban convertible peso (pre-2022)', symbol: '$', round: 0, decimal: 0, delimiter: ',', short_format: '${{amount}}', explicit_format: 'CUC${{amount}} CUC', countries: ['CU'] },
  { code: 'CUP', numeric_code: '192', name: 'Cuban peso', symbol: '$', round: 10, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '$MN {{amount}} CUP', countries: ['CU'] },
  { code: 'CVE', numeric_code: '132', name: 'Cape Verdean escudo', symbol: 'CV$', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}}$', explicit_format: '{{amount}}$ CVE', countries: ['CV'] },
  { code: 'CZK', numeric_code: '203', name: 'Czech koruna', symbol: 'Kč', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} Kč', explicit_format: '{{amount}} Kč', countries: ['CZ'] },
  { code: 'DJF', numeric_code: '262', name: 'Djiboutian franc', symbol: 'Fdj', round: 100, decimal: 0, delimiter: ',', short_format: '{{amount}} Fdj', explicit_format: '{{amount}} DJF', countries: ['DJ'] },
  { code: 'DKK', numeric_code: '208', name: 'Danish krone', symbol: 'kr.', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} DKK', countries: ['DK', 'FO', 'GL'] },
  { code: 'DOP', numeric_code: '214', name: 'Dominican peso', symbol: 'RD$', round: 100, decimal: 2, delimiter: ',', short_format: 'RD$ {{amount}}', explicit_format: 'RD$ {{amount}}', countries: ['DO'] },
  { code: 'DZD', numeric_code: '012', name: 'Algerian dinar', symbol: 'DA', round: 100, decimal: 2, delimiter: ',', short_format: 'DA {{amount}}', explicit_format: 'DA {{amount}} DZD', countries: ['DZ'] },
  { code: 'EGP', numeric_code: '818', name: 'Egyptian pound', symbol: 'E£', round: 1, decimal: 2, delimiter: ',', short_format: 'LE {{amount}}', explicit_format: 'LE {{amount}} EGP', countries: ['EG'] },
  { code: 'ERN', numeric_code: '232', name: 'Eritrean nakfa', symbol: 'Nfk', round: 1, decimal: 2, delimiter: ',', short_format: 'Nkf {{amount}}', explicit_format: 'Nkf {{amount}} ERN', countries: ['ER'] },
  { code: 'ETB', numeric_code: '230', name: 'Ethiopian birr', symbol: 'Br', round: 1, decimal: 2, delimiter: ',', short_format: 'Br{{amount}}', explicit_format: 'Br{{amount}} ETB', countries: ['ET'] },
  { code: 'EUR', numeric_code: '978', name: 'Euro', symbol: '€', round: 0.95, decimal: 2, delimiter: ',', short_format: '€{{amount}}', explicit_format: '€{{amount}} EUR', countries: ['AX', 'EU', 'AD', 'AT', 'BE', 'HR', 'CY', 'EE', 'FI', 'FR', 'GF', 'TF', 'DE', 'GR', 'GP', 'IE', 'IT', 'XK', 'LV', 'LT', 'LU', 'MT', 'MQ', 'YT', 'MC', 'ME', 'NL', 'PT', 'RE', 'BL', 'MF', 'PM', 'SM', 'SK', 'SI', 'ES', 'VA'] },
  { code: 'FJD', numeric_code: '242', name: 'Fiji dollar', symbol: '$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: 'FJ${{amount}}', countries: ['FJ'] },
  { code: 'FKP', numeric_code: '238', name: 'Falkland Islands pound', symbol: '£', round: 1, decimal: 2, delimiter: ',', short_format: '£{{amount}}', explicit_format: '£{{amount}} FKP', countries: ['FK'] },
  { code: 'GBP', numeric_code: '826', name: 'Pound sterling', symbol: '£', round: 1, decimal: 2, delimiter: ',', short_format: '£{{amount}}', explicit_format: '£{{amount}} GBP', countries: ['UK', 'IM', 'JE', 'GG', 'SH-TA'] },
  { code: 'GEL', numeric_code: '981', name: 'Georgian lari', symbol: '₾', round: 1, decimal: 2, delimiter: ',', short_format: '₾{{amount}}', explicit_format: '₾{{amount}} GEL', countries: ['GE'] },
  { code: 'GHS', numeric_code: '936', name: 'Ghanaian cedi', symbol: 'GH₵', round: 1, decimal: 2, delimiter: ',', short_format: 'GH₵{{amount}}', explicit_format: 'GH₵{{amount}}', countries: ['GH'] },
  { code: 'GIP', numeric_code: '292', name: 'Gibraltar pound', symbol: '£', round: 1, decimal: 2, delimiter: ',', short_format: '£{{amount}}', explicit_format: '£{{amount}} GIP', countries: ['GI'] },
  { code: 'GMD', numeric_code: '270', name: 'Gambian dalasi', symbol: 'D', round: 1, decimal: 2, delimiter: ',', short_format: 'D {{amount}}', explicit_format: 'D {{amount}} GMD', countries: ['GM'] },
  { code: 'GNF', numeric_code: '324', name: 'Guinean franc', symbol: 'FG', round: 1000, decimal: 0, delimiter: ',', short_format: 'FG {{amount}}', explicit_format: 'FG {{amount}} GNF', countries: ['GN'] },
  { code: 'GTQ', numeric_code: '320', name: 'Guatemalan quetzal', symbol: 'Q', round: 1, decimal: 2, delimiter: ',', short_format: 'Q {{amount}}', explicit_format: 'Q{{amount}} GTQ', countries: ['GT'] },
  { code: 'GYD', numeric_code: '328', name: 'Guyanese dollar', symbol: 'G$', round: 100, decimal: 2, delimiter: ',', short_format: 'G$ ${{amount}}', explicit_format: '${{amount}} GYD', countries: ['GY'] },
  { code: 'HKD', numeric_code: '344', name: 'Hong Kong dollar', symbol: 'HK$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: 'HK${{amount}}', countries: ['HK'] },
  { code: 'HNL', numeric_code: '340', name: 'Honduran lempira', symbol: 'L', round: 1, decimal: 2, delimiter: ',', short_format: 'L{{amount}}', explicit_format: 'L {{amount}} HNL', countries: ['HN'] },
  { code: 'HRK', numeric_code: '191', name: 'Croatian dinar (pre-2023)', symbol: 'kn', round: 1, decimal: 2, delimiter: ',', short_format: 'kn{{amount}}', explicit_format: 'kn{{amount}} HRK', countries: ['HR'] },
  { code: 'HTG', numeric_code: '332', name: 'Haitian gourde', symbol: 'G', round: 100, decimal: 2, delimiter: ',', short_format: 'G {{amount}}', explicit_format: '{{amount}} HTG', countries: ['HT'] },
  { code: 'HUF', numeric_code: '348', name: 'Hungarian forint', symbol: 'Ft', round: 100, decimal: 2, delimiter: ',', short_format: '{{amount}} Ft', explicit_format: '{{amount}} Ft', countries: ['HU'] },
  { code: 'IDR', numeric_code: '360', name: 'Indonesian rupiah', symbol: 'Rp', round: 1000, decimal: 2, delimiter: ',', short_format: 'Rp {{amount}}', explicit_format: 'Rp {{amount}} IDR', countries: ['ID'] },
  { code: 'ILS', numeric_code: '376', name: 'Israeli new shekel', symbol: '₪', round: 1, decimal: 2, delimiter: ',', short_format: '₪{{amount}}', explicit_format: '{{amount}} NIS', countries: ['IL'] },
  { code: 'INR', numeric_code: '356', name: 'Indian rupee', symbol: '₹', round: 100, decimal: 2, delimiter: ',', short_format: '₹{{amount}}', explicit_format: 'Rs. {{amount}}', countries: ['IN', 'BT'] },
  { code: 'IQD', numeric_code: '368', name: 'Iraqi dinar', symbol: 'د.ع', round: 0, decimal: 0, delimiter: ',', short_format: '{{amount}} IQD', explicit_format: '{{amount}} IQD', countries: ['IQ'] },
  { code: 'IRR', numeric_code: '364', name: 'Iranian rial', symbol: '﷼', round: 1000, decimal: 0, delimiter: ',', short_format: '﷼ {{amount}}', explicit_format: '﷼ {{amount}} IRR', countries: ['IR'] },
  { code: 'ISK', numeric_code: '352', name: 'Icelandic króna (plural: krónur)', symbol: 'Ikr', round: 100, decimal: 0, delimiter: ',', short_format: '{{amount}} kr', explicit_format: '{{amount}} ISK', countries: ['IS'] },
  { code: 'JMD', numeric_code: '388', name: 'Jamaican dollar', symbol: 'J$', round: 100, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} JMD', countries: ['JM'] },
  { code: 'JOD', numeric_code: '400', name: 'Jordanian dinar', symbol: 'د.أ', round: 0, decimal: 0, delimiter: ',', short_format: '{{amount}} JD', explicit_format: '{{amount}} JOD', countries: ['JO'] },
  { code: 'JPY', numeric_code: '392', name: 'Japanese yen', symbol: '¥', round: 100, decimal: 0, delimiter: ',', short_format: '¥{{amount}}', explicit_format: '¥{{amount}} JPY', countries: ['JP'] },
  { code: 'KES', numeric_code: '404', name: 'Kenyan shilling', symbol: 'Ksh', round: 100, decimal: 2, delimiter: ',', short_format: 'KSh{{amount}}', explicit_format: 'KSh{{amount}}', countries: ['KE'] },
  { code: 'KGS', numeric_code: '417', name: 'Kyrgyzstani som', symbol: 'лв', round: 100, decimal: 2, delimiter: ',', short_format: 'лв{{amount}}', explicit_format: 'лв{{amount}}', countries: ['KG'] },
  { code: 'KHR', numeric_code: '116', name: 'Cambodian riel', symbol: '៛', round: 1000, decimal: 2, delimiter: ',', short_format: 'KHR{{amount}}', explicit_format: 'KHR{{amount}}', countries: ['KH'] },
  { code: 'KMF', numeric_code: '174', name: 'Comoro franc', symbol: 'CF', round: 100, decimal: 0, delimiter: ',', short_format: '{{amount}} CF', explicit_format: '{{amount}} CF', countries: ['KM'] },
  { code: 'KPW', numeric_code: '408', name: 'North Korean won', symbol: '₩', round: 0, decimal: 0, delimiter: ',', short_format: '₩{{amount}}', explicit_format: '₩{{amount}} KPW', countries: ['KP'] },
  { code: 'KRW', numeric_code: '410', name: 'South Korean won', symbol: '₩', round: 1000, decimal: 0, delimiter: ',', short_format: '₩{{amount}}', explicit_format: '₩{{amount}} KRW', countries: ['KR'] },
  { code: 'KWD', numeric_code: '414', name: 'Kuwaiti dinar', symbol: 'KD', round: 0, decimal: 0, delimiter: ',', short_format: '{{amount}} KD', explicit_format: '{{amount}} KWD', countries: ['KW'] },
  { code: 'KYD', numeric_code: '136', name: 'Cayman Islands dollar', symbol: 'CI$', round: 1, decimal: 2, delimiter: ',', short_format: '${{amount}}', explicit_format: '${{amount}} KYD', countries: ['KY'] },
  { code: 'KZT', numeric_code: '398', name: 'Kazakhstani tenge', symbol: '₸', round: 100, decimal: 2, delimiter: ',', short_format: '₸{{amount}}', explicit_format: '₸{{amount}} KZT', countries: ['KZ'] },
  { code: 'LAK', numeric_code: '418', name: 'Lao kip', symbol: '₭', round: 1000, decimal: 2, delimiter: ',', short_format: '₭{{amount}}', explicit_format: '₭{{amount}} LAK', countries: ['LA'] },
  { code: 'LBP', numeric_code: '422', name: 'Lebanese pound', symbol: 'ل', round: 1000, decimal: 2, delimiter: ',', short_format: 'L£{{amount}}', explicit_format: 'L£{{amount}} LBP', countries: ['LB'] },
  { code: 'LKR', numeric_code: '144', name: 'Sri Lankan rupee', symbol: 'රු', round: 100, decimal: 2, delimiter: ',', short_format: 'Rs {{amount}}', explicit_format: 'Rs {{amount}} LKR', countries: ['LK'] },
  { code: 'LRD', numeric_code: '430', name: 'Liberian dollar', symbol: 'L$', round: 100, decimal: 2, delimiter: ',', short_format: 'L${{amount}}', explicit_format: 'L${{amount}} LRD', countries: ['LR'] },
  { code: 'LSL', numeric_code: '426', name: 'Lesotho loti', symbol: 'M', round: 1, decimal: 2, delimiter: ',', short_format: 'M{{amount}}', explicit_format: 'M{{amount}} LSL', countries: ['LS'] },
  { code: 'LTL', numeric_code: '440', name: 'Lithuanian litas (pre-1993)', symbol: 'Lt', round: 0, decimal: 0, delimiter: ',', short_format: 'Lt {{amount}}', explicit_format: 'Lt {{amount}} LTL', countries: ['LT'] },
  { code: 'LVL', numeric_code: '428', name: 'Latvian lats (pre-1993)', symbol: 'ℒ︁𝓈', round: 0, decimal: 0, delimiter: ',', short_format: 'Ls {{amount}}', explicit_format: 'Ls {{amount}} LVL', countries: ['LV'] },
  { code: 'LYD', numeric_code: '434', name: 'Libyan dinar', symbol: 'ل.د', round: 0, decimal: 0, delimiter: ',', short_format: 'LD {{amount}}', explicit_format: 'LD {{amount}} LYD', countries: ['LY'] },
  { code: 'MAD', numeric_code: '504', name: 'Moroccan dirham', symbol: '.د.م', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} dh', explicit_format: 'Dh {{amount}} MAD', countries: ['MA', 'EH'] },
  { code: 'MDL', numeric_code: '498', name: 'Moldovan leu', symbol: 'MDL', round: 1, decimal: 2, delimiter: ',', short_format: '{{amount}} MDL', explicit_format: '{{amount}} MDL', countries: ['MD'] },
  { code: 'MGA', numeric_code: '969', name: 'Malagasy ariary', symbol: 'Ar', round: 0, decimal: 0, delimiter: ',', short_format: 'Ar {{amount}}', explicit_format: 'Ar {{amount}} MGA', countries: ['MG'] },
  { code: 'MKD', numeric_code: '807', name: 'Macedonian denar', symbol: 'MKD', round: 100, decimal: 2, delimiter: ',', short_format: 'ден{{amount}}', explicit_format: 'ден{{amount}} MKD', countries: ['MK'] },
  { code: 'MMK', numeric_code: '104', name: 'Myanmar kyat', symbol: 'K', round: 1000, decimal: 2, delimiter: ',', short_format: 'K{{amount}}', explicit_format: 'K{{amount}} MMK', countries: ['MM'] },
  { code: 'MNT', numeric_code: '496', name: 'Mongolian tögrög', symbol: '₮', round: 1000, decimal: 2, delimiter: ',', short_format: '{{amount}} ₮', explicit_format: '{{amount}} MNT', countries: ['MN'] },
  { code: 'MOP', numeric_code: '446', name: 'Macanese pataca', symbol: 'MOP$', round: 1, decimal: 2, delimiter: ',', short_format: 'MOP${{amount}}', explicit_format: 'MOP${{amount}}', countries: ['MO'] },
  // { code: "MRU", numeric_code: "929", name: "Mauritanian ouguiya", symbol: "UM", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["MR"] },
  { code: 'MRO', numeric_code: '478', name: 'Mauritanian ouguiya (legacy code) [1973–2017]', symbol: 'UM', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MR'] },
  { code: 'MUR', numeric_code: '480', name: 'Mauritian rupee', symbol: 'MURs', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MU'] },
  { code: 'MVR', numeric_code: '462', name: 'Maldivian rufiyaa', symbol: 'MVR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MV'] },
  { code: 'MWK', numeric_code: '454', name: 'Malawian kwacha', symbol: 'MWK', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MW'] },
  { code: 'MXN', numeric_code: '484', name: 'Mexican peso', symbol: 'MX$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MX'] },
  // { code: "MXV", numeric_code: "979", name: "Mexican Unidad de Inversion (UDI) (funds code)", symbol: "MXV", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["MX"] },
  { code: 'MYR', numeric_code: '458', name: 'Malaysian ringgit', symbol: 'RM', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MY'] },
  { code: 'MZN', numeric_code: '943', name: 'Mozambican metical', symbol: 'MTn', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['MZ'] },
  { code: 'NAD', numeric_code: '516', name: 'Namibian dollar', symbol: 'N$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NA'] },
  { code: 'NGN', numeric_code: '566', name: 'Nigerian naira', symbol: '₦', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NG'] },
  { code: 'NIO', numeric_code: '558', name: 'Nicaraguan córdoba', symbol: 'C$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NI'] },
  { code: 'NOK', numeric_code: '578', name: 'Norwegian krone', symbol: 'Nkr', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NO', 'SJ', 'BV'] },
  { code: 'NPR', numeric_code: '524', name: 'Nepalese rupee', symbol: 'NPRs', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NP'] },
  { code: 'NZD', numeric_code: '554', name: 'New Zealand dollar', symbol: 'NZ$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['NZ', 'CK', 'NU', 'PN', 'TK'] },
  { code: 'OMR', numeric_code: '512', name: 'Omani rial', symbol: 'OMR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['OM'] },
  { code: 'PAB', numeric_code: '590', name: 'Panamanian balboa', symbol: 'B/.', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PA'] },
  { code: 'PEN', numeric_code: '604', name: 'Peruvian sol', symbol: 'S/.', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PE'] },
  { code: 'PGK', numeric_code: '598', name: 'Papua New Guinean kina', symbol: 'PGK', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PG'] },
  { code: 'PHP', numeric_code: '608', name: 'Philippine peso', symbol: '₱', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PH'] },
  { code: 'PKR', numeric_code: '586', name: 'Pakistani rupee', symbol: 'PKRs', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PK'] },
  { code: 'PLN', numeric_code: '985', name: 'Polish złoty', symbol: 'zł', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PL'] },
  { code: 'PYG', numeric_code: '600', name: 'Paraguayan guaraní', symbol: '₲', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PY'] },
  { code: 'QAR', numeric_code: '634', name: 'Qatari riyal', symbol: 'QR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['QA'] },
  { code: 'RON', numeric_code: '946', name: 'Romanian leu', symbol: 'RON', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['RO'] },
  // { code: "RSD", numeric_code: "941", name: "Serbian dinar", symbol: "RSD", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["RS"] },
  { code: 'RUB', numeric_code: '643', name: 'Russian ruble', symbol: 'RUB', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['RU'] },
  { code: 'RWF', numeric_code: '646', name: 'Rwandan franc', symbol: 'RWF', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['RW'] },
  { code: 'SAR', numeric_code: '682', name: 'Saudi riyal', symbol: 'SR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SA'] },
  { code: 'SBD', numeric_code: '090', name: 'Solomon Islands dollar', symbol: 'SBD', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SB'] },
  { code: 'SCR', numeric_code: '690', name: 'Seychelles rupee', symbol: 'SCR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SC'] },
  { code: 'SDG', numeric_code: '938', name: 'Sudanese pound', symbol: 'SDG', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SD'] },
  { code: 'SEK', numeric_code: '752', name: 'Swedish krona (plural: kronor)', symbol: 'Skr', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SE'] },
  { code: 'SGD', numeric_code: '702', name: 'Singapore dollar', symbol: 'S$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SG'] },
  { code: 'SHP', numeric_code: '654', name: 'Saint Helena pound', symbol: 'SHP', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SH', 'SH-AC'] },
  // { code: "SLE", numeric_code: "925", name: "Sierra Leonean leone (new leone)", symbol: "SLE", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["SL"] },
  // { code: "SLL", numeric_code: "694", name: "Sierra Leonean leone (old leone)", symbol: "SLL", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["SL"] },
  { code: 'SOS', numeric_code: '706', name: 'Somali shilling', symbol: 'Ssh', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SO'] },
  { code: 'SRD', numeric_code: '968', name: 'Surinamese dollar', symbol: 'SRD', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SR'] },
  // { code: "SSP", numeric_code: "728", name: "South Sudanese pound", symbol: "SSP", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["South Sudan"] },
  { code: 'STN', numeric_code: '930', name: 'São Tomé and Príncipe dobra', symbol: 'STN', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['ST'] },
  { code: 'STD', numeric_code: '678', name: 'São Tomé and Príncipe dobra (legacy code) [1977–2018]', symbol: 'STD', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['ST'] },
  { code: 'SVC', numeric_code: '222', name: 'Salvadoran colón', symbol: 'SVC', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SV'] },
  { code: 'SYP', numeric_code: '760', name: 'Syrian pound', symbol: 'SY£', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SY'] },
  { code: 'SZL', numeric_code: '748', name: 'Swazi lilangeni', symbol: 'SZL', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SZ'] },
  { code: 'THB', numeric_code: '764', name: 'Thai baht', symbol: '฿', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TH'] },
  { code: 'TJS', numeric_code: '972', name: 'Tajikistani somoni', symbol: 'TJS', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TJ'] },
  { code: 'TMT', numeric_code: '934', name: 'Turkmenistan manat', symbol: 'TMT', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TM'] },
  { code: 'TND', numeric_code: '788', name: 'Tunisian dinar', symbol: 'DT', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TN'] },
  { code: 'TOP', numeric_code: '776', name: 'Tongan paʻanga', symbol: 'T$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TO'] },
  { code: 'TRY', numeric_code: '949', name: 'Turkish lira', symbol: '₺', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TR'] },
  { code: 'TTD', numeric_code: '780', name: 'Trinidad and Tobago dollar', symbol: 'TT$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TT'] },
  { code: 'TWD', numeric_code: '901', name: 'New Taiwan dollar', symbol: 'NT$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TW'] },
  { code: 'TZS', numeric_code: '834', name: 'Tanzanian shilling', symbol: 'TSh', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['TZ'] },
  { code: 'UAH', numeric_code: '980', name: 'Ukrainian hryvnia', symbol: '₴', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['UA'] },
  { code: 'UGX', numeric_code: '800', name: 'Ugandan shilling', symbol: 'USh', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['UG'] },
  { code: 'USD', numeric_code: '840', name: 'United States dollar', symbol: '$', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['US', 'AS', 'IO', 'VG', 'BQ', 'EC', 'SV', 'GU', 'MH', 'FM', 'MP', 'PW', 'PA', 'PR', 'TL', 'TC', 'VI', 'UM'] },
  // { code: "USN", numeric_code: "997", name: "United States dollar (next day) (funds code)", symbol: "USN", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["US"] },
  // { code: "UYI", numeric_code: "940", name: "Uruguay Peso en Unidades Indexadas (URUIURUI) (funds code)", symbol: "UYI", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["UY"] },
  { code: 'UYU', numeric_code: '858', name: 'Uruguayan peso', symbol: '$U', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['UY'] },
  // { code: "UYW", numeric_code: "927", name: "Unidad previsional", symbol: "UYW", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["UY"] },
  { code: 'UZS', numeric_code: '860', name: 'Uzbekistan sum', symbol: 'UZS', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['UZ'] },
  { code: 'VED', numeric_code: '926', name: 'Venezuelan digital bolívar', symbol: 'VED', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['VE'] },
  { code: 'VEF', numeric_code: '937', name: 'Venezuelan bolívar fuerte (pre-2018)', symbol: 'Bs.F.', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['VE'] },
  // { code: "VES", numeric_code: "928", name: "Venezuelan sovereign bolívar", symbol: "VES", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["VE"] }, // ???????? now?
  { code: 'VND', numeric_code: '704', name: 'Vietnamese đồng', symbol: '₫', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['VN'] },
  { code: 'VUV', numeric_code: '548', name: 'Vanuatu vatu', symbol: 'VUV', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['VU'] },
  { code: 'WST', numeric_code: '882', name: 'Samoan tala', symbol: 'WST', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['WS'] },
  { code: 'XAF', numeric_code: '950', name: 'CFA franc BEAC', symbol: 'FCFA', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['CM', 'CF', 'CG', 'TD', 'GQ', 'GA'] },
  { code: 'XAG', numeric_code: '961', name: 'Silver (one troy ounce)', symbol: 'XAG', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: [] },
  { code: 'XAU', numeric_code: '959', name: 'Gold (one troy ounce)', symbol: 'XAU', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: [] },
  // { code: "XBA", numeric_code: "955", name: "European Composite Unit (EURCO) (bond market unit)", symbol: "XBA", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  // { code: "XBB", numeric_code: "956", name: "European Monetary Unit (E.M.U.-6) (bond market unit)", symbol: "XBB", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  // { code: "XBC", numeric_code: "957", name: "European Unit of Account 9 (E.U.A.-9) (bond market unit)", symbol: "XBC", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  // { code: "XBD", numeric_code: "958", name: "European Unit of Account 17 (E.U.A.-17) (bond market unit)", symbol: "XBD", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  { code: 'XCD', numeric_code: '951', name: 'East Caribbean dollar', symbol: 'XCD', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['AI', 'AG', 'DM', 'GD', 'MS', 'KN', 'LC', 'VC'] },
  { code: 'XDR', numeric_code: '960', name: 'Special drawing rights', symbol: 'XDR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['International Monetary Fund'] },
  { code: 'XOF', numeric_code: '952', name: 'CFA franc BCEAO', symbol: 'CFA', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['BJ', 'BF', 'CI', 'GW', 'ML', 'NE', 'SN', 'TG'] },
  // { code: "XPD", numeric_code: "964", name: "Palladium (one troy ounce)", symbol: "XPD", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  { code: 'XPF', numeric_code: '953', name: 'CFP franc (franc Pacifique)', symbol: 'XPF', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['PF', 'NC', 'WF'] },
  // { code: "XPT", numeric_code: "962", name: "Platinum (one troy ounce)", symbol: "XPT", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  // { code: "XSU", numeric_code: "994", name: "SUCRE", symbol: "XSU", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["AG", "BO", "CU", "DM", "GD", "NI", "KN", "LC", "VC", "VE"] },
  // { code: "XTS", numeric_code: "963", name: "Code reserved for testing", symbol: "XTS", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  // { code: "XUA", numeric_code: "965", name: "ADB Unit of Account", symbol: "XUA", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: ["African Development Bank"] },
  // { code: "XXX", numeric_code: "999", name: "No currency", symbol: "XXX", round: 9999999, decimal: 111111, delimiter: "DE_LI", short_format: "FORSHRT", explicit_format: "FORMEX", countries: [] },
  { code: 'YER', numeric_code: '886', name: 'Yemeni rial', symbol: 'YR', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['YE'] },
  { code: 'ZAR', numeric_code: '710', name: 'South African rand', symbol: 'R', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['SZ', 'LS', 'NA', 'ZA'] },
  { code: 'ZMK', numeric_code: '894', name: 'Zambian kwacha (pre-2013)', symbol: 'ZMK', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['ZM'] },
  { code: 'ZMW', numeric_code: '967', name: 'Zambian kwacha', symbol: 'ZK', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['ZM'] },
  { code: 'ZWL', numeric_code: '932', name: 'Zimbabwean dollar (fifth)', symbol: 'ZWL', round: 9999999, decimal: 111111, delimiter: 'DE_LI', short_format: 'FORSHRT', explicit_format: 'FORMEX', countries: ['ZW'] },
] as const

/**
 * Get all currencies
 */
export function getList(): CurrencyInfo[] {
  return CURRENCIES as unknown as CurrencyInfo[]
}

/**
 * Filter currencies by country
 */
export function filterByCountry(iso2: CountryCode): CurrencyInfo[] {
  return CURRENCIES.filter(c => c.countries.find(c => c === iso2.toUpperCase()))
}

/**
 * Filter currencies by name
 */
export function filterByName(name: CountryName): CurrencyInfo[]
export function filterByName(name: string): CurrencyInfo[] {
  return CURRENCIES.filter((c) => c.name.includes(name))
}

/**
 * Get currency info by country ISO2 code (e.g., 'US')
 */
export function getByCountry(iso2: CountryCode): CurrencyInfo | undefined
export function getByCountry(iso2: string): CurrencyInfo | undefined {
  return CURRENCIES.find((c) => c.countries.find(c => c === iso2.toUpperCase()))
}

/**
 * Get currency info by ISO code (e.g., 'USD')
 */
export function getByCode(code: CurrencyCode): CurrencyInfo | undefined
export function getByCode(code: string): CurrencyInfo | undefined {
  return CURRENCIES.find((c) => c.code === code)
}

/**
 * Get currency info by symbol (e.g., '$')
 */
export function getBySymbol(symbol: CurrencySymbol): CurrencyInfo | undefined
export function getBySymbol(symbol: string): CurrencyInfo | undefined {
  return CURRENCIES.find((c) => c.symbol === symbol)
}

/**
 * Get currency info by numeric code (e.g., '840')
 */
export function getByNumericCode(numCode: CountryNumericCode): CurrencyInfo | undefined
export function getByNumericCode(numCode: number | string): CurrencyInfo | undefined {
  return CURRENCIES.find((c) => c.numeric_code === numCode?.toString())
}
