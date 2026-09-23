
export interface SessionEntityProps {
  id?: string;
  userId: string;
  refreshTokenHash: string;
  expiresAt: Date;
  revokedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export class Session {
  constructor(private props: SessionEntityProps){}

  static create(props: Omit<SessionEntityProps, 'id' | "createdAt" | "updatedAt">){
    const now = new Date()

    return new Session({
      ...props,
      revokedAt: props.revokedAt ?? null,
      createdAt: now,
      updatedAt: now,
    })
  }

  isExpired(): boolean {
    return this.props.expiresAt <= new Date();
  }

  isRevoked(): boolean {
    return this.props.revokedAt !== null;
  }

  canRefresh(): boolean {
    return !this.isExpired() && !this.isRevoked();
  }

  revoke() {
    this.props.revokedAt = new Date();
    this.props.updatedAt = new Date();
  }

  get propsData() {
    return this.props;
  }
}