import appDataSource from "../../data-source";
import { ICreateCompanie } from "../../interfaces/companies";
import { Company } from "../../entities/company.entity";


const createCompanieService = async ({ name, cnpj }: ICreateCompanie) => {
  const companieRepository = appDataSource.getRepository(Company);

  const companies = await companieRepository.find();

  const companieAlreadyExists = companies.find(
    (user: any) => user.cnpj === cnpj
  );

  if (companieAlreadyExists) {
    throw new Error("Companie already exists!");
  }

  const newCompanie = new Company();

  (newCompanie.name = name),
    (newCompanie.cnpj = cnpj),
    companieRepository.create(newCompanie);
  await companieRepository.save(newCompanie);

  return newCompanie;
};

export default createCompanieService;