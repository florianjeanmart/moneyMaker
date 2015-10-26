package be.moneyMaker.models.account;

import be.moneyMaker.models.AuditedAbstractEntity;

import javax.persistence.*;

/**
 * Created by florian on 2/09/14.
 */
@Entity
public class Account extends AuditedAbstractEntity {

	@Id
	private Long id;

	private String lastName;

	private String firstName;

	@Column(nullable = false, unique =  true)
	private String email;

	@Column(nullable = false)
	private String password;

	public Account(String email, String password) {
		this.email = email;
		this.password = password;
	}

	public Long getId() {
		return id;
	}

	public void setId(Long id) {
		this.id = id;
	}

	public String getLastName() {
		return lastName;
	}

	public void setLastName(String lastName) {
		this.lastName = lastName;
	}

	public String getFirstName() {
		return firstName;
	}

	public void setFirstName(String firstName) {
		this.firstName = firstName;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getPassword() {
		return password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

	@Override
	public String toString() {
		return "Account{" +
				"id=" + id +
				", lastName='" + lastName + '\'' +
				", firstName='" + firstName + '\'' +
				", email='" + email + '\'' +
				", password='" + password + '\'' +
				'}';
	}
}
