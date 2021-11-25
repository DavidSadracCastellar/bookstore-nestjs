import { EntityRepository, Repository } from "typeorm";
import { Book } from "./book.entity";

@EntityRepository(Book)
export class BookRepository extends Repository<Book> {
    async getBooksByAuthor(authorId: number): Promise<Book[]> {
        const query = this.createQueryBuilder('user')
        .leftJoinAndSelect('user.books', 'book')
        .where('book.usersId = :usersId', { authorId });
        return await query.getMany();
    }
}