import:py logging;
import:py from jac_cloud.core.architype { NodeAnchor }


glob logger = logging.getLogger("library_system");

node Librarian {
    has user_name: str;
    has email: str;
}

node Student {
    has name: str;
    has email: str;
}

node Book {
    has title: str;
    has author: str;
}

edge borrow {
    
}

edge add {

}



#visit Librarian profile
walker visit_librarian_profile {

    obj __specs__ {
        static has auth: bool = False;
    }

    has user_name: str;
    has email: str;

    can visit_librarian_profile with `root entry {
        visit [-->(`?Librarian)] else {
            logger.info("Creating new Librarian profile");
            new_profile = here ++> Librarian(user_name=self.user_name, email= self.email); # if a new Librarian
            visit new_profile;
        }
    }
}


# #check librarian 
# walker check_librarian {

#     can check_librarian with `root entry {
#         logger.info(f"This is Librarian: {[here-->(`?Librarian)]}");
#         report [here-->(`?Librarian)];
#     }
# }



# view all books
walker view_all_books {

    obj __specs__ {
        static has auth: bool = False;
    }

    has books:list = [];

    can view_all_books with `root entry{
        for book in NodeAnchor.Collection.find({"name": "Book"}) {
            book_node = book.architype;
            self.books.append(book_node);
        }
        report self.books;
    }
}



#view all students
walker view_all_students {

    obj __specs__ {
        static has auth: bool = False;
    }

    has students:list = [];

    can view_all_students with `root entry{
        for student in NodeAnchor.Collection.find({"name": "Student"}) {
            student_node = student.architype;
            self.students.append(student_node);
        }
        report self.students;
    }
}



# view all borrowings
walker view_all_borrowings {

    obj __specs__ {
        static has auth: bool = False;
    }

    has borrowings:list = [];

    can view_all_borrowingss with `root entry{
        for student in NodeAnchor.Collection.find({"name": "Student"}) {
            student_node = student.architype;
            self.borrowings.append(f"{student_node}: {[student_node-:borrow:->]}"); 
        }
        report self.borrowings;
    }
}



# add new student
walker add_student :visit_librarian_profile: {

    has student_name: str;
    has student_email: str;

    can add_book with Librarian entry {
        student_node = here +:add:+> Student(name=self.student_name, email=self.student_email);
        visit student_node;
        # logger.info("Student node visited");
    }

    can report_student with Student entry {
        logger.info(f"New student added: {here}");
        report here;
    }
}



# add new book
walker add_book :visit_librarian_profile: {

    has title: str;
    has author: str;

    can add_book with Librarian entry {
        book_node = here +:add:+> Book(title=self.title, author=self.author);
        visit book_node;
        # logger.info("Book node visited");
    }

    can report_book with Book entry {
        logger.info(f"New book added: {here}");
        report here;
    }
}



# remove book
walker remove_book :visit_librarian_profile: {

    has book_id: str;

    can remove_book with Librarian entry {
        book_node = &self.book_id;
        if book_node {
            here del-:add:-> book_node;
            logger.info(f"Book removed: {book_node}");
            report book_node;
        } else {
            logger.info("Invalid details entered, Check again");
        }
    }
}



# remove student
walker remove_student :visit_librarian_profile: {

    has student_id: str;

    can remove_student with Librarian entry {
        student_node = &self.student_id;
        if student_node {
            here del-:add:-> student_node;
            logger.info(f"Student removed: {student_node}");
            report student_node;
        } else {
            logger.info("Invalid details entered, Check again");
        }
        
    }
}



# borrow book
walker borrow_book :visit_librarian_profile: {

    has student_ref_id: str;
    has book_ref_id: str;
     
    can borrow_book with Librarian entry { 
        # Jac.unrestrict(here, level="CONNECT");
        # logger.info(f"book ref jid: {self.book_ref_id}");
        # logger.info(f"student ref jid: {self.student_ref_id}");
        
        borrow_book_node = &self.book_ref_id;
        # Jac.unrestrict(borrow_book_node, level="CONNECT");
        logger.info(f"borrowing book: {borrow_book_node}");
        borrow_student_node = &self.student_ref_id;
        logger.info(f"borrowing student: {borrow_student_node}");
        if not (borrow_book_node && borrow_student_node) {
            logger.info("Invalid details entered, Check again");
        }
        elif [borrow_book_node<-:borrow:-(`?Student)] {
            logger.info("This book is currently unavailable");
        } else {
            borrow_student_node +:borrow:+> borrow_book_node;    #connecting book node and student node
            visit borrow_book_node;
        }
    }

    can report_borrow with Book entry {
        logger.info("Book borrowed successfully");
        report here;
    }
}



# return book
walker return_book :visit_librarian_profile: {

    has student_ref_id: str;
    has book_ref_id: str;

    can return_book with Librarian entry {
        returning_book_node = &self.book_ref_id;
        returning_student_node = &self.student_ref_id;
        # Jac.unrestrict(returning_book_node, level="CONNECT");
        if not (returning_book_node && returning_student_node) {
            logger.info("Invalid details entered, Check again");
        } elif [returning_student_node-:borrow:->returning_book_node] {
            returning_student_node del-:borrow:-> returning_book_node;   #disconnecting book node and student node
            logger.info(f"Book returned successfully : {returning_book_node}");
            report returning_book_node;
        } else {
            logger.info("Invalid details entered, Check again");
        }
    }
}

